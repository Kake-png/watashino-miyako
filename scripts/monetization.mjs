import fs from 'node:fs';
export const settings = JSON.parse(fs.readFileSync(new URL('./site-settings.json', import.meta.url)));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for (const [key, pattern] of Object.entries({gaMeasurementId:/^G-[A-Z0-9]+$/, searchConsoleVerification:/^[A-Za-z0-9_-]+$/, adsensePublisherId:/^ca-pub-\d{16}$/})) {
  if (settings[key] && !pattern.test(settings[key])) throw Error(`Invalid ${key}`);
}
if (settings.contactEmail && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(settings.contactEmail)) throw Error('Invalid contactEmail');
export function applyMonetization(html, page, stationSlugs, today = new Date().toISOString().slice(0,10)) {
 html = html.replace(/<!--BUSINESS_START-->[\s\S]*?<!--BUSINESS_END-->/g, '');
 let head = '';
 if(settings.searchConsoleVerification) head += `<meta name="google-site-verification" content="${esc(settings.searchConsoleVerification)}">`;
 if(settings.adsensePublisherId) head += `<meta name="google-adsense-account" content="${esc(settings.adsensePublisherId)}">`;
 if(settings.gaMeasurementId) head += `<meta name="atlas-ga-id" content="${esc(settings.gaMeasurementId)}"><script defer src="/assets/analytics.js?v=41"></script>`;
 html = html.replace('</head>', `<!--BUSINESS_START-->${head}<!--BUSINESS_END--></head>`);
 const cards=[];
 for(const ad of settings.sponsors) {
   if(!stationSlugs.includes(ad.station) || !ad.name || !ad.description || !ad.url || !ad.start || !ad.end) throw Error('Incomplete sponsor');
   if(new URL(ad.url).protocol !== 'https:') throw Error('Sponsor URL must use HTTPS');
   for(const d of [ad.start,ad.end]) if(!/^\d{4}-\d{2}-\d{2}$/.test(d) || new Date(d).toISOString().slice(0,10)!==d) throw Error('Invalid sponsor date');
   if(ad.start>ad.end) throw Error('Invalid sponsor period');
   if(page!==`station/${ad.station}` || today<ad.start || today>ad.end) continue;
   cards.push(`<article><p>広告</p><h3>${esc(ad.name)}</h3><p>${esc(ad.description)}</p><a href="${esc(ad.url)}" rel="sponsored noopener">店舗の公式サイトへ</a></article>`);
 }
 let body = cards.length ? `<aside class="page local-sponsors" aria-label="この街の店舗広告"><h2>この街のお店から</h2>${cards.join('')}</aside>` : '';
 if(settings.contactEmail) body+=`<div class="page"><p><a href="mailto:${esc(settings.contactEmail)}">お問い合わせ・広告掲載のご相談</a></p></div>`;
 html = html.replace('<footer ', `<!--BUSINESS_START-->${body}<!--BUSINESS_END--><footer `);
 return html;
}
