// Editorial choices use confirmed station conditions, rather than guessed rankings.
const themes = {
  movies: ['映画館の近くに住む｜東京・神奈川の街・駅を探す', '映画館の近くで暮らしたい人へ。南東京〜横浜の掲載駅から、確認済みの映画館と駅からのアクセス、1K参考家賃や路線を比べられます。'],
  books: ['本屋や図書館の近くに住む｜東京・神奈川の街・駅を探す', '本屋や図書館に立ち寄りやすい街で暮らしたい人へ。南東京〜横浜の掲載駅から、徒歩圏の大型本屋・図書館と1K参考家賃、路線を比べられます。'],
  cycling: ['サイクリングを楽しめる街に住む｜東京・神奈川の駅を探す', 'サイクリングを楽しめる街で暮らしたい人へ。南東京〜横浜の掲載駅から、整備されたコースへのアクセス、1K参考家賃や路線を比べられます。'],
  'night-walk': ['夜景を楽しめる街に住む｜東京・神奈川の駅を探す', '夜景を楽しめる場所の近くで暮らしたい人へ。南東京〜横浜の掲載駅から、夜景スポットと駅からのアクセス、1K参考家賃や路線を比べられます。'],
  strolling: ['散歩を楽しめる街に住む｜東京・神奈川の駅を探す', '散歩先を見つけやすい街で暮らしたい人へ。南東京〜横浜の掲載駅から、公園や川沿い、海・港、商店街などの条件と1K参考家賃を比べられます。'],
  drinking: ['飲み歩きを楽しめる街に住む｜東京・神奈川の駅を探す', '飲み歩きを楽しめる街で暮らしたい人へ。南東京〜横浜の掲載駅から、徒歩圏または直通で行ける近隣駅の酒場街と1K参考家賃、路線を比べられます。'],
  'weekend-mobility': ['週末旅行に出かけやすい街に住む｜羽田・新幹線・車で探す', '週末旅行に出かけやすい街を探したい人へ。南東京〜横浜の掲載駅を、羽田空港・新幹線駅・高速道路へのアクセス別に紹介します。'],
  'car-life': ['高速道路を使いやすい街に住む｜東京・神奈川の駅を探す', '車で遠出しやすい住む街を探したい人へ。南東京〜横浜の掲載駅から、高速道路入口まで車の経路推計で15分以内の駅を紹介します。']
};
const stationChoices = {
 oimachi:['映画館・夜景','cinema','view'], omori:['映画館・図書館','cinema','library'], kamata:['サイクリング・図書館','cycle','library'],
 osaki:['図書館・夜景','library','view'], gotanda:['図書館・夜景','library','view'], musashikoyama:['図書館・公園','library','park'],
 togoshiginza:['図書館・商店街','library','street'], nakanobu:['図書館・商店街','library','street'], hatanodai:['図書館・公園','library','park'],
 ookayama:['図書館・公園','library','park'], jiyugaoka:['図書館・夜景','library','view'], 'keikyu-kamata':['サイクリング・図書館','cycle','library'],
 kawasaki:['映画館・サイクリング','cinema','cycle'], musashikosugi:['サイクリング・図書館','cycle','library'], yokohama:['映画館・夜景','cinema','view']
};
export function themeMetadata(id) { if (!themes[id]) throw Error(`Missing theme metadata: ${id}`); return {title:themes[id][0],description:themes[id][1]}; }
export function stationMetadata(station) {
  const choice=stationChoices[station.slug]; if(!choice) throw Error(`Missing station metadata: ${station.slug}`);
  const [label,...tags]=choice;
  for(const tag of tags) if(!station.tags.includes(tag)||station.evidence[tag]?.status!=='verified'||station.evidence[tag]?.value!==true) throw Error(`${station.slug}: unverified metadata ${tag}`);
  const description = `${station.name}駅周辺で住む街を探す人へ。${station.summary.replace(/施設名・アクセス・確認日は各条件の根拠で確認できます。$/, '')}交通・1K参考家賃と条件の根拠・出典を確認できます。`;
  return {title:`${station.name}駅の住みやすさ｜${label}を楽しむ街探し｜街えらび案内所`,description};
}
