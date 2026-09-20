window.ATLAS_DATA = (() => {
  const sources = {
    "oimachi-station": {
      file: "images/oimachi-station.webp",
      alt: "大井町駅前と駅舎",
      caption: "複数路線が集まる大井町駅。駅前に用事が集まり、方向によって街の表情が変わる。",
      date: "2026年2月",
      author: "Nesnad",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Oimachi_Station_-_2026_feb_14_various_15.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "oimachi-street": {
      file: "images/oimachi-street.webp",
      alt: "大井町駅周辺の大井銀座入口交差点",
      caption: "駅の近くを東西に歩くと、商業施設の正面とは異なる日常の通りへつながる。",
      date: "2025年1月",
      author: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Walk_around_Oimachi_station_(36941).jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "oimachi-cyclist": {
      file: "images/oimachi-cyclist.webp",
      alt: "大井町駅周辺の細い生活道路を走る自転車",
      caption: "大通りから一歩入ると、建物の間を縫う細い生活道路も多い。自転車では道幅を確かめたい。",
      date: "2025年1月",
      author: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Walk_around_Oimachi_station_(30319).jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "oimachi-shopping": {
      file: "images/oimachi-shopping.webp",
      alt: "阪急大井町ガーデン周辺",
      caption: "駅前には買い物・食事・宿泊などの機能がまとまる。駅から離れる前に用事を済ませやすい構造。",
      date: "2025年1月",
      author: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Walk_around_Oimachi_station_(87933).jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "oimachi-rail": {
      file: "images/oimachi-rail.webp",
      alt: "大井町駅付近の線路と街並み",
      caption: "線路が街を分けるため、距離だけでなく使う出口と踏切・跨線経路も住み心地に関わる。",
      date: "2025年1月",
      author: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Walk_around_Oimachi_station_(99974).jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "oimachi-alley": {
      file: "images/oimachi-alley.webp",
      alt: "大井町駅周辺の細い路地",
      caption: "駅周辺は大規模施設だけではない。建物の裏側や細街路まで歩くと、日常の距離感が見えてくる。",
      date: "2025年1月",
      author: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Walk_around_Oimachi_station_(38466).jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "omori-station": {
      file: "images/omori-station.webp",
      alt: "大森駅東口の駅舎",
      caption: "大森駅東口。駅前の商業と、海側・山側で異なる徒歩環境を見比べたい。",
      date: "2008年9月",
      author: "パリカール",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:JR_omori_station_east_entrance.JPG",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "omori-14": {
      file: "images/omori-14.webp",
      alt: "大森周辺の昔ながらの商店",
      caption: "駅周辺には日常店が点在する。大型店だけでなく、帰宅動線に何が続くかを見る。",
      date: "2023年9月",
      author: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Walk_around_Omori_14.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "omori-20": {
      file: "images/omori-20.webp",
      alt: "大森周辺の木造店舗と生活道路",
      caption: "新しい建物と古い商いが近接する。通りごとの年代差が街の表情をつくる。",
      date: "2023年9月",
      author: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Walk_around_Omori_20.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "omori-21": {
      file: "images/omori-21.webp",
      alt: "大森周辺の緑道",
      caption: "駅前の密度から離れ、歩いて休める余白がどうつながるかも確認したい。",
      date: "2023年9月",
      author: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Walk_around_Omori_21.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "omori-41": {
      file: "images/omori-41.webp",
      alt: "大森周辺の住宅地",
      caption: "幹線道路や駅前を離れた住宅地。静けさは駅からの分数より、道の選び方で変わる。",
      date: "2023年9月",
      author: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Walk_around_Omori_41.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "omori-47": {
      file: "images/omori-47.webp",
      alt: "大森周辺の水路沿いの歩道",
      caption: "海側では水路と道路が生活動線になる。橋の位置と歩道の連続性も現地下見の対象。",
      date: "2023年9月",
      author: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Walk_around_Omori_47.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "kamata-station": {
      file: "images/kamata-station.webp",
      alt: "JR蒲田駅の駅舎",
      caption: "JR・東急が集まる蒲田駅。東西で商業の広がり方が異なり、京急蒲田とは別の生活圏をつくる。",
      date: "2018年2月",
      author: "東京特許許可局",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:JR_Kamata_sta_001.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "kamata-east": {
      file: "images/kamata-east.webp",
      alt: "JR蒲田駅東側の街並み",
      caption: "東口側の街路。駅前の密度が高く、昼と夜で人の流れが変わる場所。",
      date: "2017年1月",
      author: "Doricono",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:East_of_JR_Kamata_Station_in_Tokyo.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "kamata-asuto": {
      file: "images/kamata-asuto.webp",
      alt: "京急蒲田商店街あすと",
      caption: "JR蒲田と京急蒲田の間は、商店街と幹線道路をつなぐ徒歩の生活軸になる。",
      date: "2022年1月",
      author: "Drivephotographer",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Keikyu_Kamata_Shopping_Street_Asuto.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "kamata-keikyu": {
      file: "images/kamata-keikyu.webp",
      alt: "京急蒲田駅と駅前",
      caption: "空港方向の移動を重視するなら京急蒲田側も別に歩く。JR蒲田からは徒歩移動が必要。",
      date: "2022年1月",
      author: "Drivephotographer",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Keikyuu_Kamata_station-3.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    }
  };

  const stations = [
    {
      slug: "oimachi", name: "大井町", kana: "おおいまち", area: "品川区", lat: 35.6065, lng: 139.7347,
      lines: ["JR京浜東北線", "東急大井町線", "りんかい線"], status: "feature",
      tags: ["multi", "shopping", "books", "airport", "bike"],
      descriptor: "三方向へ伸びる交通と、駅前に集まる日常",
      summary: "都心・湾岸・城南西部へ路線が分かれ、駅前で買い物や食事をまとめやすい。住む方向を決める前に、線路を越える動線と駅前再編の範囲を歩いて確かめたい街。",
      strengths: ["3路線を使い分けられる", "駅前に日常の用事が集まりやすい", "品川・湾岸・羽田方面を考えやすい"],
      cautions: ["出口と線路の東西で帰宅動線が変わる", "駅前は変化の途中で、写真と現況がずれる場合がある"],
      walk: [
        ["0–3分", "商業・交通", "駅ビルと大型施設、バス・タクシー動線が重なる。"],
        ["3–7分", "通りの分岐", "大通り、商店、公共施設方向へ生活動線が分かれる。"],
        ["7–12分", "住宅地へ", "坂や細街路が現れ、方角による差が大きくなる。"]
      ],
      notes: {
        transport: "JRで品川・東京方面、りんかい線で湾岸・新宿方面、東急で大岡山・自由が丘方面へ分岐する。乗換の幅そのものが特徴。",
        daily: "駅前で買い物を完結しやすい一方、住宅側の小さな店や坂道は方向ごとに違う。帰宅ルート単位で見ると理解しやすい。",
        atmosphere: "駅前は密度が高く、数分歩くと生活道路へ切り替わる。大規模施設だけで街を判断しない方がよい。",
        weekend: "駅前で用事を済ませる休日と、りんかい線・JR・東急で外へ出る休日の両方を組みやすい。"
      },
      images: ["oimachi-station", "oimachi-street", "oimachi-cyclist", "oimachi-shopping", "oimachi-rail", "oimachi-alley"]
    },
    {
      slug: "omori", name: "大森", kana: "おおもり", area: "大田区・品川区", lat: 35.5883, lng: 139.7281,
      lines: ["JR京浜東北線"], status: "feature",
      tags: ["shopping", "quiet", "park", "family", "bike"],
      descriptor: "ひとつのJR駅から、海側と山側へ違う暮らし",
      summary: "交通はJR京浜東北線を軸にする分、駅を出てからの生活圏が読みやすい。海側・山側、北側・南側で道幅や地形、住宅地への変わり方が異なる。",
      strengths: ["駅前の用事と住宅地の距離を調整しやすい", "公園・水辺・商業の方向差がある", "大井町・蒲田より路線構成が単純"],
      cautions: ["坂と幹線道路は住む方向で負担が変わる", "京急線側を使う場合は駅間の徒歩も確認したい"],
      walk: [
        ["0–3分", "駅前商業", "東西の出口で店の並びと道路の印象が変わる。"],
        ["3–7分", "坂と平地", "山側は高低差、海側は幹線道路や水路との関係が出る。"],
        ["7–12分", "住宅と余白", "住宅地、公園、水辺の散歩道へ生活の密度が落ち着く。"]
      ],
      notes: {
        transport: "JR京浜東北線が主軸。経路の選択肢より、駅までの歩きやすさと停車トラブル時の代替を考えたい。",
        daily: "駅前の商業を使いながら、住宅地側の店・公園・道路を組み合わせる生活になる。",
        atmosphere: "方向差が大きい街。駅名だけで静かさを判断せず、同じ徒歩10分でも海側と山側を別々に歩く。",
        weekend: "駅前完結だけでなく、水辺や公園へ向かう散歩を生活に入れやすい。"
      },
      images: ["omori-station", "omori-14", "omori-20", "omori-21", "omori-41", "omori-47"]
    },
    {
      slug: "kamata", name: "蒲田", kana: "かまた", area: "大田区", lat: 35.5624, lng: 139.7161,
      lines: ["JR京浜東北線", "東急池上線", "東急多摩川線"], status: "feature",
      tags: ["multi", "shopping", "street", "night", "airport", "bike"],
      descriptor: "商業の厚みと、JR・東急・京急をつなぐ生活軸",
      summary: "買い物と外食の選択肢が駅周辺に厚く、夜まで街が動く。京急蒲田は別駅なので、空港アクセスを重視するなら両駅間と実際の帰宅ルートを歩く必要がある。",
      strengths: ["日常の買い物と外食の幅が広い", "JR・東急と京急側を使い分けられる", "羽田空港方向を生活圏に入れやすい"],
      cautions: ["昼夜・東西で街の印象が大きく変わる", "JR蒲田と京急蒲田は同一駅ではない"],
      walk: [
        ["0–3分", "高密度な駅前", "商業、飲食、バス、人の流れが重なる。"],
        ["3–7分", "商店街の帯", "アーケードや生活店が複数方向へ続く。"],
        ["7–12分", "二つの駅の間", "京急蒲田側への徒歩軸と住宅地への分岐が現れる。"]
      ],
      notes: {
        transport: "JRと東急は蒲田駅、京急は東へ離れた京急蒲田駅。路線数だけでなく、駅間移動を含めて考える。",
        daily: "買い物・外食を駅周辺で選びやすい。便利さの代わりに、人通りや夜の音をどこまで許容するかを住む方向ごとに確かめたい。",
        atmosphere: "街の混在が蒲田らしさ。駅前の一場面だけで『賑やか』『静か』を決めず、平日夜と休日昼の両方を見る。",
        weekend: "商店街で過ごす、東急沿線へ出る、空港方面へ動くなど選択肢が分かれる。"
      },
      images: ["kamata-station", "kamata-east", "kamata-asuto", "kamata-keikyu"]
    },
    {
      slug: "osaki", name: "大崎", kana: "おおさき", area: "品川区", lat: 35.6197, lng: 139.7286,
      lines: ["JR山手線", "JR埼京線", "JR湘南新宿ライン", "りんかい線"], status: "guide",
      tags: ["multi", "quiet", "airport", "park"],
      descriptor: "業務地区の足元に、歩行者デッキと住宅が重なる",
      summary: "広域交通は強い一方、駅前はオフィス街の性格が濃い。夜と休日の店の開き方、デッキから住宅地への下り方を確認したい。"
    },
    {
      slug: "gotanda", name: "五反田", kana: "ごたんだ", area: "品川区", lat: 35.6264, lng: 139.7234,
      lines: ["JR山手線", "都営浅草線", "東急池上線"], status: "guide",
      tags: ["multi", "shopping", "night", "street"],
      descriptor: "都心交通と飲食街、その外側の住宅地",
      summary: "三路線と飲食の厚みが特徴。川沿い、駅東西、坂上の住宅地で生活の静けさが切り替わる。"
    },
    {
      slug: "musashikoyama", name: "武蔵小山", kana: "むさしこやま", area: "品川区", lat: 35.6204, lng: 139.7045,
      lines: ["東急目黒線"], status: "guide",
      tags: ["shopping", "street", "park", "family", "bike"],
      descriptor: "長い商店街と林試の森を、一本の生活圏に",
      summary: "商店街を日常動線にしやすく、公園方向にも歩ける。商店街沿いと周辺住宅地で人通りや建物の密度が変わる。"
    },
    {
      slug: "togoshiginza", name: "戸越銀座", kana: "とごしぎんざ", area: "品川区", lat: 35.6160, lng: 139.7150,
      lines: ["東急池上線", "都営浅草線（戸越）"], status: "guide",
      tags: ["multi", "shopping", "street", "bike"],
      descriptor: "商店街を横断する、細長い生活圏",
      summary: "戸越銀座駅と戸越駅を使い分け、商店街に沿って生活が伸びる。駅距離より商店街のどの地点に住むかが重要。"
    },
    {
      slug: "nakanobu", name: "中延", kana: "なかのぶ", area: "品川区", lat: 35.6050, lng: 139.7138,
      lines: ["東急大井町線", "都営浅草線"], status: "guide",
      tags: ["multi", "street", "quiet", "bike"],
      descriptor: "二路線と商店街の間にある、低層の暮らし",
      summary: "都営浅草線と大井町線を使い分けやすく、商店街と住宅地の距離が近い。路地と幹線道路の差を見たい。"
    },
    {
      slug: "hatanodai", name: "旗の台", kana: "はたのだい", area: "品川区", lat: 35.6048, lng: 139.7036,
      lines: ["東急大井町線", "東急池上線"], status: "guide",
      tags: ["multi", "quiet", "family", "street"],
      descriptor: "二本の東急線と、駅前商店のある住宅地",
      summary: "急行停車と二路線が強み。駅前の細い通りから住宅地へ自然につながり、方向ごとの坂を確認したい。"
    },
    {
      slug: "ookayama", name: "大岡山", kana: "おおおかやま", area: "大田区・目黒区", lat: 35.6074, lng: 139.6850,
      lines: ["東急目黒線", "東急大井町線"], status: "guide",
      tags: ["multi", "quiet", "books", "family", "bike"],
      descriptor: "二路線、大学、商店街が小さくまとまる",
      summary: "目黒線と大井町線を使え、駅周辺の規模が把握しやすい。坂と大通りを越えた先まで歩くと住宅地の違いが見える。"
    },
    {
      slug: "jiyugaoka", name: "自由が丘", kana: "じゆうがおか", area: "目黒区", lat: 35.6074, lng: 139.6687,
      lines: ["東急東横線", "東急大井町線"], status: "guide",
      tags: ["multi", "shopping", "books", "street", "night"],
      descriptor: "買い物の街と住宅地が、細い通りで連続する",
      summary: "休日の来街者が多い商業地だが、駅から外れると住宅地へ切り替わる。休日昼と平日夜を分けて見たい。"
    },
    {
      slug: "keikyu-kamata", name: "京急蒲田", kana: "けいきゅうかまた", area: "大田区", lat: 35.5607, lng: 139.7237,
      lines: ["京急本線", "京急空港線"], status: "guide",
      tags: ["multi", "airport", "shopping", "street"],
      descriptor: "羽田への線路と、JR蒲田へ続く徒歩の軸",
      summary: "空港アクセスを重視する生活の拠点。JR蒲田との間に商店街が続くが、二駅は分けて考える方がよい。"
    },
    {
      slug: "kawasaki", name: "川崎", kana: "かわさき", area: "川崎市川崎区", lat: 35.5314, lng: 139.6969,
      lines: ["JR東海道線", "JR京浜東北線", "JR南武線", "京急本線"], status: "guide",
      tags: ["multi", "shopping", "books", "night", "airport"],
      descriptor: "大型商業と広域交通を一つの駅圏に集める",
      summary: "東京・横浜の間で路線と買い物が集中する。JRと京急、東西の出口、繁華街と住宅側を切り分けて見る必要がある。"
    },
    {
      slug: "musashikosugi", name: "武蔵小杉", kana: "むさしこすぎ", area: "川崎市中原区", lat: 35.5758, lng: 139.6596,
      lines: ["JR横須賀線", "JR南武線", "東急東横線", "東急目黒線"], status: "guide",
      tags: ["multi", "shopping", "family", "park", "bike"],
      descriptor: "複数駅舎と高層住宅、昔からの街が隣り合う",
      summary: "路線は強いがホーム間の距離もある。駅のどちら側を使うか、川沿い・商店街側とのつながりを確かめたい。"
    },
    {
      slug: "yokohama", name: "横浜", kana: "よこはま", area: "横浜市西区", lat: 35.4658, lng: 139.6223,
      lines: ["JR各線", "東急東横線", "京急本線", "相鉄線", "市営地下鉄"], status: "guide",
      tags: ["multi", "shopping", "books", "night", "airport"],
      descriptor: "巨大駅の利便性と、出口ごとに別の生活圏",
      summary: "交通・買い物の選択肢は大きいが、駅構内と出口間の移動も大きい。『横浜駅徒歩』を出口と経路まで分解して考える。"
    }
  ];

  const tagLabels = {
    multi: "複数路線", shopping: "駅前で買い物", street: "商店街", quiet: "住宅地へ切替",
    airport: "羽田方向", books: "本・文化", park: "公園・水辺", bike: "自転車", family: "家族の生活動線", night: "夜も動く街"
  };

  return { stations, sources, tagLabels };
})();
