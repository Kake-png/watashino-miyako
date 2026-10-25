const brand = '街えらび案内所';
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
export function enhanceSeo(html, path, url) {
  const origin = new URL(url).origin;
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
    .replace(/<meta (?:property="og:[^"]+"|name="twitter:[^"]+")[^>]*>/g, '');
  if (!path) html = html.replace(/<title>.*?<\/title>/, `<title>${brand}｜駅の特徴・暮らしの条件から住む街を探す</title>`)
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="図書館・大型書店・散歩・夜景・交通アクセスなど、駅ごとの特徴を比べて住む街を探せる街えらび案内所。南東京〜横浜の15駅を、確認済みの条件と出典付きの情報で紹介します。">');
  if (!html.includes('name="description"')) html = html.replace('</head>', '<meta name="description" content="街えらび案内所の運営方針・掲載情報・写真の出典について。"></head>');
  const title = html.match(/<title>(.*?)<\/title>/)[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/)[1];
  const schema = [{ '@context':'https://schema.org', '@type':path ? 'WebPage':'WebSite', '@id':url + '#webpage', name:path ? title : brand, url, description,
    ...(path ? {isPartOf:{'@id':origin+'/#website'}} : {'@id':origin+'/#website',inLanguage:'ja'}) }];
  // Two levels reflect visible navigation; no invented reviews, ratings or business identity.
  if (path.startsWith('station/')) schema[0].breadcrumb = ({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:brand,item:origin+'/'},
    {'@type':'ListItem',position:2,name:title.split('｜')[0],item:url}
  ]});
  const image = origin + '/images/social-card-v40.png';
  const tags = `<meta property="og:type" content="website"><meta property="og:locale" content="ja_JP"><meta property="og:site_name" content="${brand}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="街えらび案内所 — 駅ごとの特徴から、あなたに合う街を探す"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${image}"><meta name="twitter:image:alt" content="街えらび案内所">`;
  if (!html.includes('name="robots"')) html = html.replace('</head>','<meta name="robots" content="index,follow,max-image-preview:large"></head>');
  return html.replace('</head>',`${tags}<script type="application/ld+json">${json(schema[0])}</script></head>`);
}
