// Compact theme entry pages, built from the same verified conditions as search.
export function themeContent(theme, data, escape) {
  const trip = [['airport','飛行機で出かける'],['shinkansen','新幹線で出かける'],['expressway','車で出かける']];
  const selected = (s, tag) => s.tags.includes(tag) && s.evidence[tag]?.status === 'verified';
  const mapLink = tags => {
    const params = new URLSearchParams({tags:tags.join(','),match:theme.matchMode === 'all' ? 'all' : 'any',themes:''});
    // Only preselect a hobby when its conditions exactly match the guide.
    const hobby = tags.length === 1 ? {cinema:'movies',cycle:'cycling',drinks:'drinks'}[tags[0]] : null;
    if (hobby) { params.set('hobbies',hobby); params.set('autoRequired',tags[0]); }
    return `/?${params}#atlas`;
  };
  const overall = {
    movies: {label: '映画館のある駅を地図で探す', tags: ['cinema'], hobby: 'movies'},
    cycling: {label: 'サイクリングの条件で地図から探す', tags: ['cycle'], hobby: 'cycling'},
    drinking: {label: '飲み歩きの条件で地図から探す', tags: ['drinks'], hobby: 'drinks'},
    books: {label: '本屋と図書館の両方を地図で探す', tags: ['large_bookstore','library'], hobby: 'reading', note: 'このページは、どちらか一方に該当する駅も紹介しています。'},
    'weekend-mobility': {label: '羽田・新幹線・高速道路のすべてを地図で探す', tags: ['airport','shinkansen','expressway'], hobby: 'travel', note: 'このページは、いずれか一つに該当する駅も紹介しています。'},
    'night-walk': {label: '夜景の条件で地図から探す', tags: ['view']},
    'car-life': {label: '高速道路の条件で地図から探す', tags: ['expressway']},
    strolling: {label: '公園・川・海・商店街のすべてを地図で探す', tags: ['park','river','sea','street'], note: 'このページは、いずれか一つに該当する駅も紹介しています。'}
  }[theme.id];
  if (!overall) throw Error(`Missing theme search link: ${theme.id}`);
  const overallParams = new URLSearchParams({tags: overall.tags.join(','), match:'all', themes:''});
  if (overall.hobby) { overallParams.set('hobbies', overall.hobby); overallParams.set('autoRequired', overall.tags.join(',')); }
  const overallLink = `<div class="theme-primary-search"><a class="theme-map-link theme-primary-map-link" href="/?${escape(overallParams.toString())}#atlas">${escape(overall.label)} →</a>${overall.note ? `<p>${escape(overall.note)}</p>` : ''}</div>`;
  const brief = (s, tag) => {
    const text = s.evidence[tag].text;
    if(tag === 'view' && s.slug === 'musashikosugi') return '東急スクエア4F展望デッキは駅直結。通常21時まで、12月〜3月は17時までのため夜景目的では季節に注意';
    if(tag === 'expressway') {
      const entry = text.match(/([\p{Script=Han}\p{Script=Katakana}ー]+入口)（([^）]+)）/u);
      return `${entry ? entry[1]+'（'+entry[2]+'）' : '高速道路入口'}へ、渋滞を含まない経路推計で15分以内`;
    }
    if(tag === 'large_bookstore' && /取材|運営者資料|現行|候補を/.test(text.slice(0,35))) return '大型本屋の条件に該当。店舗・アクセスは駅の詳細へ';
    if(tag === 'street' && /対象を|現行|公式店舗|組合の/.test(text.slice(0,30))) return '駅周辺に条件を満たす商店街';
    if(tag === 'drinks' && !text.startsWith('大森') && !text.startsWith('五反田') && !text.startsWith('野毛')) return '駅周辺の酒場街を確認。店舗・アクセスは駅の詳細へ';
    if(tag === 'river' && /現に|対象を/.test(text.slice(0,20))) return '川沿いの散歩先あり。経路と所要の目安は駅の詳細へ';
    if(tag === 'sea' && text.length > 160) return '海・運河沿いの散歩先あり。経路と所要の目安は駅の詳細へ';
    if(tag === 'park' && /市の面積|調査/.test(text.slice(0,20))) return '3ha以上の公園へ徒歩15分以内の距離換算';
    const sentences = text.match(/[^。]+。?/g) || [text];
    const result = sentences.slice(0,tag === 'view' ? 3 : 1).join('');
    return result.length > 160 ? `${data.tagLabels[tag]}の条件に該当。施設・アクセスは駅の詳細へ` : result;
  };
  const rows = tags => data.stations.filter(s=>tags.some(t=>selected(s,t))).map(s=> {
    const facts=tags.filter(t=>selected(s,t));
    return `<li class="theme-station"><div class="theme-station-heading"><h3><a href="/station/${escape(s.slug)}/">${escape(s.name)}駅</a></h3><span>${escape(s.area)}</span></div><ul class="theme-facts">${facts.slice(0,2).map(t=>`<li><span>${escape(data.tagLabels[t])}</span>${escape(brief(s,t))}</li>`).join('')}</ul><p class="theme-station-meta">1K参考家賃 ${Number.isFinite(s.rent1k)?escape(s.rent1k.toFixed(2))+'万円':'未確認'} · ${escape(s.lines.slice(0,3).join('・'))}${s.lines.length>3?' ほか':''}</p><a class="theme-detail" href="/station/${escape(s.slug)}/">駅の詳細・出典を見る →</a></li>`;
  }).join('');
  const section=(tags,title)=>{const cards=rows(tags);return `<section class="theme-results"><div class="theme-results-heading"><h2>${escape(title)}</h2><span>${data.stations.filter(s=>tags.some(t=>selected(s,t))).length}駅</span></div>${cards?`<ul class="theme-stations">${cards}</ul>`:'<p>この条件の掲載駅は現在ありません。</p>'}<a class="theme-map-link" href="${escape(mapLink(tags))}">この条件で地図から探す →</a></section>`;};
  return `${overallLink}<p class="theme-scope">南東京〜横浜の掲載駅から紹介。${escape(theme.criteria.join('／'))}。 <a href="/criteria/">判定基準</a></p>${theme.id==='weekend-mobility'?trip.map(([tag,title])=>section([tag],title)).join(''):section(theme.tags,'候補駅')}<p class="theme-footnote">家賃は1Kの参考相場。出典・確認日、施設や経路の注意点は各駅の詳細へ。</p><p><a href="/themes/">← 暮らし別の一覧</a></p>`;
}
