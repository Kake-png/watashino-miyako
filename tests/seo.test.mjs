import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
const root = path.resolve(import.meta.dirname, '../public');
const files = fs.readdirSync(root, {recursive:true}).filter(f => f.endsWith('.html'));
test('all pages have consistent identity, metadata and social image; indexable titles/descriptions are unique', () => {
 const titles=new Set(), descriptions=new Set();
 for (const file of files) {
  const html=fs.readFileSync(path.join(root,file),'utf8'), d=new JSDOM(html).window.document;
  assert(!/駅まち図譜|わたしのみやこ/.test(html),file);
  assert.equal(d.querySelectorAll('link[rel="canonical"]').length,1,file);
  assert.equal(d.querySelectorAll('meta[name="description"]').length,1,file);
  assert.equal(d.querySelectorAll('h1').length,1,file);
  const canonical=d.querySelector('link[rel="canonical"]').href;
  const schema=JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent);
  assert.equal(schema.url,canonical,file);
  assert.equal(d.querySelector('meta[property="og:url"]').content,canonical,file);
  const img=new URL(d.querySelector('meta[property="og:image"]').content);
  assert(fs.existsSync(path.join(root,img.pathname)),file);
  if (d.querySelector('meta[name="robots"]').content.includes('noindex')) continue;
  const desc=d.querySelector('meta[name="description"]').content;
  assert(!titles.has(d.title),'duplicate title: '+file); titles.add(d.title);
  assert(!descriptions.has(desc),'duplicate description: '+file);descriptions.add(desc);
 }
});
test('contact page links to the supplied Google Form and does not rely on a contact Worker', () => {
 const html=fs.readFileSync(path.join(root,'contact/index.html'),'utf8');
 const d=new JSDOM(html).window.document;
 const link=d.querySelector('a[href="https://forms.gle/n291N3gCkJ53yYA27"]');
 assert(link, 'Google Form link is present');
 assert.equal(link.target, '_blank');
 assert.equal(link.rel, 'noopener noreferrer');
 assert(!html.includes('/api/contact'));
 const wrangler=JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname,'../wrangler.jsonc'),'utf8'));
 assert(!wrangler.main && !wrangler.assets.binding && !wrangler.assets.run_worker_first);
});
test('sitemap contains canonical indexable HTML only, with no query variants',()=>{
 const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
 for(const [,url] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)){
  const u=new URL(url);assert.equal(u.search,'');
  const d=new JSDOM(fs.readFileSync(path.join(root,u.pathname,'index.html'),'utf8')).window.document;
  assert.equal(d.querySelector('link[rel="canonical"]').href,url);
  assert(!d.querySelector('meta[name="robots"]').content.includes('noindex'));
 }
});
