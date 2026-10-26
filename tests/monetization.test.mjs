import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import fs from 'node:fs';
import {settings,applyMonetization} from '../scripts/monetization.mjs';
const html='<html><head></head><body><footer class="site-footer"></footer></body></html>';
test('local sponsor is escaped, restricted to contracted station and period, and idempotent',()=>{
 settings.sponsors=[{station:'oimachi',name:'<店>',description:'説明',url:'https://example.com/',start:'2026-10-01',end:'2026-10-31'}];
 const render=(p,d)=>applyMonetization(html,p,['oimachi'],d);
 const active=render('station/oimachi','2026-10-26');
 assert(active.includes('&lt;店&gt;')); assert(active.includes('rel="sponsored noopener"'));
 assert(!render('station/osaki','2026-10-26').includes('<article>'));
 assert(!render('station/oimachi','2026-11-01').includes('<article>'));
 assert.equal(applyMonetization(active,'station/oimachi',['oimachi'],'2026-10-26'),active);
 settings.sponsors=[];
});
test('analytics sends nothing before consent or after refusal; opt-in loads one tag',()=>{
 const code=fs.readFileSync(new URL('../public/assets/analytics.js',import.meta.url),'utf8');
 for(const consent of [null,'denied','granted']) {
  const dom=new JSDOM('<meta name="atlas-ga-id" content="G-TEST123"><footer class="site-footer"></footer>',{url:'https://example.com/',runScripts:'outside-only'});
  if(consent)dom.window.localStorage.setItem('atlas-analytics-consent-v1',consent);
  dom.window.eval(code);
  assert.equal(dom.window.document.querySelectorAll('script[src*="googletagmanager"]').length,consent==='granted'?1:0);
  dom.window.close();
 }
});

test('configured GA ID reaches all published pages once and opt-in config',()=>{
 assert.equal(settings.gaMeasurementId,'G-H94HSFCFJE');
 const root=new URL('../public/',import.meta.url);
 for(const file of fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html'))){
  const doc=new JSDOM(fs.readFileSync(new URL(file,root),'utf8')).window.document;
  assert.equal(doc.querySelectorAll('meta[name="atlas-ga-id"]').length,1,file);
  assert.equal(doc.querySelector('meta[name="atlas-ga-id"]').content,settings.gaMeasurementId,file);
  assert.equal(doc.querySelectorAll('script[src^="/assets/analytics.js"]').length,1,file);
  assert.equal(doc.querySelectorAll('script[src*="googletagmanager"]').length,0,file);
 }
 const code=fs.readFileSync(new URL('../public/assets/analytics.js',import.meta.url),'utf8');
 const dom=new JSDOM(`<meta name="atlas-ga-id" content="${settings.gaMeasurementId}"><footer class="site-footer"></footer>`,{url:'https://example.com/',runScripts:'outside-only'});
 dom.window.localStorage.setItem('atlas-analytics-consent-v1','granted');dom.window.eval(code);
 const config=dom.window.dataLayer.find(args=>args[0]==='config');
 assert.equal(config[1],settings.gaMeasurementId);
 assert.equal(config[2].allow_google_signals,false);
 dom.window.close();
});
