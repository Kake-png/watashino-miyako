const ATLAS_DATA = (() => {
  const sources = {
    "osaki-station": {
      file: "images/osaki-station.webp",
      alt: "大崎駅の駅舎と駅前",
      caption: "駅前は歩行者デッキと大規模な建物が連続する。地上へ下りた後の住宅地とのつながりを確認したい。",
      date: "2024年5月",
      author: "Smiley.toerist",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Osaki_station_2024_2.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "gotanda-view": {
      file: "images/gotanda-view.webp",
      alt: "五反田駅から大崎方向を見た線路と街並み",
      caption: "線路、川、幹線道路、坂が近接する五反田。駅からどちらへ抜けるかで帰宅経路が大きく変わる。",
      date: "2024年10月",
      author: "Syced",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:From_Gotanda_station,_looking_towards_Osaki.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "musashikoyama-palm": {
      file: "images/musashikoyama-palm.webp",
      alt: "武蔵小山のパルム商店街",
      caption: "駅から長く続く商店街は、雨の日の買い物にも使いやすい。南側入口から、アーケードと周辺の生活動線を確認できる。",
      date: "2026年8月",
      author: "Suikotei",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Musashi-koyama_Palm_20260801.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "togoshiginza-station": {
      file: "images/togoshiginza-station.webp",
      alt: "戸越銀座駅の五反田方面改札",
      caption: "ホームと改札が商店街の生活動線に直接つながる。駅前だけでなく商店街のどの区間に住むかが重要になる。",
      date: "2024年11月",
      author: "MaedaAkihiko",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Togoshi-ginza-STA_Gate-for-Gotanda.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "nakanobu-skiproad": {
      file: "images/nakanobu-skiproad.webp",
      alt: "都営浅草線中延駅のホーム",
      caption: "都営浅草線と東急大井町線を使い分けられる中延。駅同士の位置と商店街までの徒歩動線を確認したい。",
      date: "2023年9月",
      author: "LERK",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Toei-subway-A03-Nakanobu-station-platform-20230930-132833.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "hatanodai-platform": {
      file: "images/hatanodai-platform.webp",
      alt: "旗の台駅のホーム",
      caption: "大井町線と池上線が交わる駅。乗換の便利さに対し、駅の外は小さな通りと住宅地へすぐ切り替わる。",
      date: "2022年3月",
      author: "MaedaAkihiko",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Hatanodai-STA_Home3-4.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "ookayama-station": {
      file: "images/ookayama-station.webp",
      alt: "大岡山駅のホームと線路",
      caption: "二路線が交わる大岡山駅。駅前の大学・病院と、その外側の住宅地へのつながりを見たい。",
      date: "2025年10月",
      author: "Tatsuo Yamashita",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:%E5%A4%A7%E5%B2%A1%E5%B1%B1%E9%A7%85_(54893949710).jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "jiyugaoka-station": {
      file: "images/jiyugaoka-station.webp",
      alt: "自由が丘駅前と街並み",
      caption: "駅前に商業と人の流れが集まる。休日の混雑と、住宅側へ抜けた後の静けさを分けて見たい。",
      date: "2026年4月",
      author: "ノーマルエディタ",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Jiyugaoka_Station_Tokyo_2026.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "kawasaki-east": {
      file: "images/kawasaki-east.webp",
      alt: "川崎駅東口広場",
      caption: "東口は地下街、商業、バス、繁華街への動線が重なる。西口とは生活の組み立て方が大きく異なる。",
      date: "2024年12月",
      author: "Euph0956",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:JRE_Kawasaki-STA_East_Exit_Plaza.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "musashikosugi-station": {
      file: "images/musashikosugi-station.webp",
      alt: "JR武蔵小杉駅の北改札",
      caption: "複数の駅施設が広い範囲に分かれる武蔵小杉。路線間の徒歩距離と使う改札まで含めて考えたい。",
      date: "2024年2月",
      author: "Mister0124",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:JR_East_Musashi-Kosugi_Station_North_Gate_in_Kawasaki_City_Nakahara_Ward,_Kanagawa_Pref_20240203.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "yokohama-east": {
      file: "images/yokohama-east.webp",
      alt: "横浜駅東側の全景",
      caption: "巨大駅では出口選びそのものが生活条件になる。東西の移動と、駅構内を抜ける時間を別に見たい。",
      date: "2023年5月",
      author: "MaedaAkihiko",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Yokohama-STA_East-2023.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
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
      alt: "大森駅東口の駅舎と駅前広場",
      caption: "大森駅東口。駅前の商業と、海側・山側で異なる徒歩環境を見比べたい。",
      date: "2026年5月",
      author: "Punkssand",
      license: "CC0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:%E5%A4%A7%E6%A3%AE%E9%A7%85%E6%9D%B1%E5%8F%A3.jpg",
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
      alt: "蒲田駅の跨線通路から見るホームと周辺の街並み",
      caption: "線路を挟んで街が東西に分かれる蒲田駅。JR・東急の駅と京急蒲田は、別の生活圏として歩いて確かめたい。",
      date: "2026年6月",
      author: "Nesnad",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Kamata_Station_-_Tokyo_-_2026_June_17_various_01.jpg",
      changes: "縮小・WebP変換・表示時にトリミング"
    },
    "kamata-east": {
      file: "images/kamata-east.webp",
      alt: "蒲田駅構内の改札前コンコース",
      caption: "改札前にJR・東急と東西の出口への動線が集まる。住む方向からホームまでの移動も確認したい。",
      date: "2026年6月",
      author: "Nesnad",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Kamata_Station_-_Tokyo_-_2026_June_17_various_02.jpg",
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

  const stationProfiles = {
    osaki: {
      strengths: ["山手線と広域路線を使い分けられる", "歩行者デッキで駅前施設を移動しやすい", "品川・新宿・湾岸方面へ経路を組みやすい"],
      cautions: ["オフィス街のため平日と休日で店の開き方が変わる", "デッキと地上、線路の反対側で徒歩経路が分かれる"],
      walk: [["0–3分", "デッキと業務街", "改札から大規模施設へ立体的な歩行経路が続く。"], ["3–7分", "地上へ下りる", "デッキの出口ごとに幹線道路・川・住宅側へ分かれる。"], ["7–12分", "住宅地との境目", "坂や細い道が現れ、駅前とは異なる静けさになる。"]],
      notes: { transport: "山手線に加え、埼京線・湘南新宿ライン・りんかい線を使える。乗る路線によってホーム位置と混雑が違う。", daily: "駅前施設で用事をまとめやすいが、休日や夜の営業状況は平日昼と別に確認したい。", atmosphere: "駅前は業務地区のスケールが大きく、地上へ下りると住宅地との距離が急に近くなる。", weekend: "駅前完結より、山手線・りんかい線で外へ出る休日と相性がよい。" },
      images: ["osaki-station"]
    },
    gotanda: {
      strengths: ["山手線・浅草線・池上線を使い分けられる", "外食と日常の買い物が駅周辺に多い", "大崎・品川方面と城南住宅地の間に位置する"],
      cautions: ["繁華街、川沿い、坂上で夜の環境が大きく違う", "幹線道路と坂を越える経路は物件位置で負担が変わる"],
      walk: [["0–3分", "駅前と繁華街", "飲食、バス、幹線道路、人の流れが集中する。"], ["3–7分", "川と坂の分岐", "目黒川沿い、東西の坂、池上線側へ経路が分かれる。"], ["7–12分", "住宅側へ", "高低差と通りの幅によって街の音が落ち着いていく。"]],
      notes: { transport: "山手線を軸に、浅草線で都心東側・空港方向、池上線で旗の台・蒲田方向へ動ける。", daily: "駅前の店は多い。帰宅時に使う出口と、スーパーまでの坂をセットで見ると生活像が明確になる。", atmosphere: "昼の業務街、夜の飲食街、坂上の住宅地が近接する混在型。", weekend: "目黒川沿いを歩く休日と、山手線で都心へ出る休日を組みやすい。" },
      images: ["gotanda-view"]
    },
    musashikoyama: {
      strengths: ["長い商店街を日常動線にできる", "林試の森公園へ歩ける", "目黒線で都心方面へ出やすい"],
      cautions: ["商店街沿いは人通りと音が続く", "駅前再開発側と昔からの住宅地で建物の密度が異なる"],
      walk: [["0–3分", "駅前広場", "商業施設と商店街入口に人の流れが集まる。"], ["3–7分", "商店街の生活軸", "買い物をしながら帰宅できる一方、自転車と歩行者が重なる。"], ["7–12分", "公園と住宅地", "林試の森方向や商店街の外側で道と静けさが変わる。"]],
      notes: { transport: "東急目黒線一系統だが、都営三田線・東京メトロ南北線方面へ直通する列車を使える。", daily: "買い物は商店街中心に組み立てやすい。店の近さと人通りの多さが同じ軸にある。", atmosphere: "駅前の新しい建物、長いアーケード、低層住宅地が短い距離で切り替わる。", weekend: "商店街で過ごす日と林試の森を歩く日を徒歩圏で選べる。" },
      images: ["musashikoyama-palm"]
    },
    togoshiginza: {
      strengths: ["商店街を帰宅動線に組み込める", "池上線と浅草線の二駅を使い分けられる", "小さな生活店を徒歩で選びやすい"],
      cautions: ["商店街が長く、駅名だけでは実際の最寄りが決まらない", "細い道では歩行者と自転車の動線が重なる"],
      walk: [["0–3分", "ホームから商店街へ", "駅を出るとすぐ商店街の人通りに接続する。"], ["3–7分", "二駅の間", "戸越駅方向と商店街の東西で生活施設の組み合わせが変わる。"], ["7–12分", "住宅地へ枝分かれ", "商店街から一筋入ると、低層住宅と細街路が増える。"]],
      notes: { transport: "池上線の戸越銀座駅と浅草線の戸越駅は徒歩で使い分けられる。毎日の主路線を先に決めたい。", daily: "商店街が強み。大型店一か所ではなく、帰宅経路上の複数の店を使う暮らしになる。", atmosphere: "観光的に賑わう時間と、近隣の日常動線として使われる時間が重なる。", weekend: "商店街を歩くこと自体が休日の用事になる一方、混雑する時間帯も確認したい。" },
      images: ["togoshiginza-station"]
    },
    nakanobu: {
      strengths: ["浅草線と大井町線を使い分けられる", "商店街と住宅地が近い", "大井町・五反田方向へ短く移動できる"],
      cautions: ["駅施設が分かれており乗換は地上移動になる", "細街路と幹線道路で自転車・徒歩の感覚が変わる"],
      walk: [["0–3分", "二つの駅", "大井町線と浅草線の入口を結ぶ地上動線を確認する。"], ["3–7分", "商店街", "スキップロードなど日常の通りへつながる。"], ["7–12分", "低層住宅地", "静かな道が増えるが、夜の明るさと道幅を見たい。"]],
      notes: { transport: "都営浅草線で都心・空港方向、大井町線で大井町・自由が丘方面へ動ける。", daily: "大規模商業より、商店街と近隣スーパーを組み合わせる生活。", atmosphere: "駅前の規模が小さく、住宅地との切り替わりが早い。", weekend: "戸越・旗の台方面の商店街や、大井町線沿線へ小さく出かけやすい。" },
      images: ["nakanobu-skiproad"]
    },
    hatanodai: {
      strengths: ["大井町線急行と池上線を使える", "駅前商店と住宅地の距離が短い", "昭和大学病院が生活圏にある"],
      cautions: ["出口と線路で近隣道路が分断される", "坂と細い道は方角ごとに確認が必要"],
      walk: [["0–3分", "乗換駅と商店", "二路線の乗換客と駅前の小さな店が重なる。"], ["3–7分", "病院・商店街方向", "目的施設へ向かう通りと住宅側へ分かれる。"], ["7–12分", "住宅地", "坂と細街路が増え、駅前の人通りが落ち着く。"]],
      notes: { transport: "大井町線と池上線の交点。大井町・自由が丘・五反田・蒲田方向を選べる。", daily: "大型商業は周辺駅を使い、普段は駅前商店と近隣店で済ませる構成。", atmosphere: "乗換駅だが駅外は大規模繁華街ではなく、住宅地の空気が強い。", weekend: "大井町線沿線へ出る休日と、近隣の商店街を歩く休日を選べる。" },
      images: ["hatanodai-platform"]
    },
    ookayama: {
      strengths: ["目黒線と大井町線を使える", "駅前に大学・病院・商店街がまとまる", "住宅地へ短い距離で移れる"],
      cautions: ["学生の動きがある時間と休日で街の表情が変わる", "坂と環状七号線方向の移動を確認したい"],
      walk: [["0–3分", "大学と病院", "駅前に大きな施設と商店がまとまる。"], ["3–7分", "商店街と学生動線", "飲食・日用品の店と通学の流れが重なる。"], ["7–12分", "住宅地と坂", "低層住宅が増え、方角によって高低差が現れる。"]],
      notes: { transport: "目黒線で都心方面、大井町線で大井町・自由が丘方面へ動ける。", daily: "駅前規模は大きすぎず、商店街・病院・大学が日常圏にまとまる。", atmosphere: "学生街の要素はあるが、繁華街というより住宅地と教育・医療施設の街。", weekend: "洗足池方面や自由が丘方面へ散歩・短距離移動を組みやすい。" },
      images: ["ookayama-station"]
    },
    jiyugaoka: {
      strengths: ["東横線と大井町線を使える", "買い物・飲食・本や雑貨の選択肢が多い", "住宅地と商業地を徒歩で行き来できる"],
      cautions: ["休日昼は来街者が多い", "細街路・踏切・駅周辺工事で経路が変わりやすい"],
      walk: [["0–3分", "駅前商業", "細い通りに店と歩行者が密集する。"], ["3–7分", "商業の枝", "方向ごとに飲食・雑貨・生活店の性格が変わる。"], ["7–12分", "住宅地へ", "人通りが落ち着き、坂や緑のある道へ切り替わる。"]],
      notes: { transport: "東横線で渋谷・横浜方面、大井町線で大井町・二子玉川方面へ動ける。", daily: "選択肢は多いが、観光的な店と日常店を分けて見る必要がある。", atmosphere: "駅前の密度が高く、少し離れると住宅地。休日と平日夜を両方歩きたい。", weekend: "街で買い物・食事をする休日が成立する一方、混雑から離れる経路も持ちたい。" },
      images: ["jiyugaoka-station"]
    },
    "keikyu-kamata": {
      strengths: ["羽田空港へ直接向かえる", "京急本線と空港線を使える", "JR蒲田との間に商店街が続く"],
      cautions: ["JR蒲田とは同一駅ではない", "高架・幹線道路・再開発街区で徒歩経路が分かれる"],
      walk: [["0–3分", "高架駅前", "空港利用者、バス、商業施設の動線が集まる。"], ["3–7分", "商店街と幹線道路", "JR蒲田方向へ店が続き、大通りを横断する。"], ["7–12分", "住宅地またはJR側", "住む方向によって空港アクセス優先か買い物優先かが分かれる。"]],
      notes: { transport: "京急本線と空港線の分岐。品川・横浜・羽田方向を重視する生活に強い。", daily: "駅前と商店街で用事を済ませつつ、品揃えはJR蒲田側も組み合わせる。", atmosphere: "空港動線の駅と、昔からの商店街・住宅地が接している。", weekend: "羽田方面への外出、JR蒲田側の買い物、京急沿線への移動を選べる。" },
      images: ["kamata-keikyu", "kamata-asuto"]
    },
    kawasaki: {
      strengths: ["東京・横浜の両方向へ速く移動できる", "大型商業と日常の用事を駅前でまとめやすい", "京急側を含め複数路線を使える"],
      cautions: ["東口と西口で街の性格が大きく違う", "繁華街、幹線道路、イベント時の人通りを時間帯別に見たい"],
      walk: [["0–3分", "巨大な駅前", "東口は地下街・繁華街、西口は大型商業・住宅側へ分かれる。"], ["3–7分", "JRと京急の間", "二駅を結ぶ通りとバス動線に人が集まる。"], ["7–12分", "住宅側へ", "川・幹線道路・旧市街方向で道と建物の密度が変わる。"]],
      notes: { transport: "JR東海道線・京浜東北線・南武線に加え、京急川崎駅も徒歩圏。広域移動が強い。", daily: "大型店で用事をまとめやすく、外食も多い。出口をまたぐ移動時間は見込む必要がある。", atmosphere: "買い物の街、業務地、繁華街、住宅地が駅の東西に分かれる。", weekend: "駅前商業、映画、競馬場方面、多摩川方面など休日の選択肢が広い。" },
      images: ["kawasaki-east"]
    },
    musashikosugi: {
      strengths: ["都心・横浜方面へ複数路線を使える", "駅前商業と住宅機能がまとまる", "多摩川方面の散歩・自転車を組み込みやすい"],
      cautions: ["横須賀線ホームと他路線の距離が大きい", "高層街区と昔からの商店街側で生活像が異なる"],
      walk: [["0–3分", "複数の駅施設", "利用路線によって駅の中心が別の場所になる。"], ["3–7分", "高層街区と商業", "大型商業、広場、住宅棟が連続する。"], ["7–12分", "商店街・川方向", "新丸子側や多摩川側で低層の街と屋外空間が増える。"]],
      notes: { transport: "JRと東急の複数路線を使えるが、乗換距離も含めて路線を選びたい。", daily: "駅前大型店で完結しやすい一方、新丸子側など昔からの街も生活圏に入る。", atmosphere: "高層住宅の街だけでなく、商店街・河川敷・低層住宅地が周辺に残る。", weekend: "多摩川の散歩・サイクリングと、東横線沿線への外出を組みやすい。" },
      images: ["musashikosugi-station"]
    },
    yokohama: {
      strengths: ["多数の路線を使い分けられる", "買い物・食事・本・娯楽を駅周辺で選べる", "港・空港・新幹線方面への移動を組みやすい"],
      cautions: ["駅構内と出口間の移動が長い", "『横浜駅徒歩』でも川・幹線道路・線路で経路が大きく変わる"],
      walk: [["0–3分", "巨大駅の内部", "改札と出口を選ぶ段階から生活動線が始まる。"], ["3–7分", "東西の商業", "東口・西口で店、バス、道路、港方向への動線が分かれる。"], ["7–12分", "川と住宅の境目", "駅前の密度から離れ、川沿いや住宅側へ切り替わる。"]],
      notes: { transport: "JR、東急、京急、相鉄、市営地下鉄が集まる。路線数より、毎日使う改札までの距離が重要。", daily: "選択肢は非常に多いが、日用品を買う場所と帰宅口を固定すると生活しやすい。", atmosphere: "巨大商業駅であり、出口ごとに別の街。駅西口・東口を同じ生活圏と考えない方がよい。", weekend: "駅前商業、みなとみらい・港方向、都心や湘南方面への外出を組み合わせられる。" },
      images: ["yokohama-east"]
    }
  };

  const practicalNotes = {
    oimachi: { cost: "駅徒歩・築年数・管理費をそろえて見る。駅近と複数路線の利便性が募集条件に反映されやすい。", car: "幹線道路・首都高湾岸線方面へ出やすいが、駐車場費と細街路を要確認。", outdoors: "しながわ中央公園方面や湾岸方向へ自転車で動ける。", evening: "駅前は夜も用事を済ませやすい。飲食街と住宅側の距離を確認。" },
    omori: { cost: "大井町より選択幅を取りやすいが、駅距離・東西・坂で差が大きい。", car: "第一京浜・環七・首都高入口方面を使いやすい。駅前駐車場費は要確認。", outdoors: "公園、水路、海側の平坦な道を散歩・自転車に使いやすい。", evening: "駅前は人通りがある。山側・海側とも帰宅路の坂と明るさを確認。" },
    kamata: { cost: "南側の主要駅では比較対象を作りやすい。築年数と駅東西で幅がある。", car: "環八・第一京浜・羽田方面へ動けるが、駅前の混雑と駐車場条件は厳密に見る。", outdoors: "多摩川方面へ自転車で出やすい。街中は歩行者と自転車の混在に注意。", evening: "飲食と買い物は夜まで選びやすい。住む通りの音と人通りを夜に確認。" },
    osaki: { cost: "駅近・築浅だけに絞らず、駅から離れた坂側も同じ間取り・面積で比べる。", car: "幹線道路へ接続できるが、デッキ街区と一方通行で動線が複雑。", outdoors: "目黒川沿いを歩ける。大きな公園は方向を選んで移動する。", evening: "平日夜と休日で人通り・営業店舗が変わりやすい。" },
    gotanda: { cost: "駅の東西、坂上・坂下、築年数で募集条件が分かれる。徒歩分数をそろえて比べる。", car: "国道1号・首都高目黒線方面へ出られるが、駅前交通量と駐車場費は重い。", outdoors: "目黒川沿いの散歩ができる。坂を含む徒歩圏との差が特徴。", evening: "飲食店が多く夜も動く。繁華街を通るか避けるかで帰宅路が変わる。" },
    musashikoyama: { cost: "商店街沿い・外側で条件が変わる。同じ駅徒歩分数と築年数で募集を比べる。", car: "住宅街の細道が多く、車中心より徒歩・自転車向き。首都高利用は経路確認が必要。", outdoors: "林試の森公園が強い。日常散歩の目的地を作りやすい。", evening: "商店街は明るいが、一本外れた住宅路との落差を確認。" },
    togoshiginza: { cost: "都心近接の中では条件幅がある。商店街のどの位置かで駅距離が変わる。", car: "細街路と商店街の歩行者が多く、車中心の生活には経路確認が必要。", outdoors: "長い商店街を日常の散歩動線にできる。大規模自然は近隣駅方向。", evening: "商店街沿いと住宅路で明るさが変わる。閉店後の道も歩いて確認。" },
    nakanobu: { cost: "大井町・五反田より抑えやすい候補を探しやすい。二路線徒歩圏は高くなりやすい。", car: "幹線道路へ出られるが、住宅地の細道と一方通行を確認したい。", outdoors: "商店街散歩と自転車移動が中心。洗足池方面も生活圏候補。", evening: "大規模繁華街ではない。帰宅路の商店街区間と住宅区間を分けて見る。" },
    hatanodai: { cost: "二路線駅としては比較幅がある。急行停車・駅距離で差が出る。", car: "中原街道・環七方面へ接続できるが、駅周辺は細い道が多い。", outdoors: "洗足池方面へ散歩・自転車で動ける。坂の有無を確認。", evening: "駅前商店はあるが夜は住宅地の性格が強い。" },
    ookayama: { cost: "二路線を使える物件と一方の駅だけに近い物件で条件が変わる。徒歩分数を分けて比較。", car: "環七方面へ出られるが、駅周辺は徒歩中心。坂と細道を確認。", outdoors: "洗足池・緑が丘方面へ散歩や自転車を組み込みやすい。", evening: "学生の動きはあるが大規模な夜の繁華街ではない。" },
    jiyugaoka: { cost: "駅徒歩・築年数・面積を固定して見る。駅から離れた住宅地も同じ条件で比べる。", car: "細い道と人通りが多く、駅前へ車で入る生活は慎重に確認。", outdoors: "緑道や住宅街散歩と相性がよい。多摩川方面へも自転車で展開可能。", evening: "飲食は選びやすいが、夜遅くまでの生活利便は通りごとの差がある。" },
    "keikyu-kamata": { cost: "空港アクセスを持ちながら比較対象を作りやすい。JR蒲田側との距離で条件が変わる。", car: "第一京浜・環八・羽田方面へ接続しやすい。高架下と幹線道路の横断を確認。", outdoors: "多摩川・羽田方面へ自転車で出やすい。駅前は交通量が多い。", evening: "商店街は使いやすいが、JR蒲田駅前ほど夜の店は集中しない。" },
    kawasaki: { cost: "東京側の主要駅より選択幅を持ちやすいが、駅近・新築は高め。", car: "国道・首都高神奈川線方面へ動ける。駅前渋滞と駐車場費は要確認。", outdoors: "多摩川方面へ散歩・サイクリングを組み込める。", evening: "東口は夜まで動く。西口・住宅側と帰宅環境が大きく違う。" },
    musashikosugi: { cost: "駅前と新丸子側などで物件条件が変わる。路線までの実歩分数と管理費を分けて比べる。", car: "主要道路へ出られるが、駅前街区とタワー駐車場の条件を個別確認。", outdoors: "多摩川河川敷が強い。散歩、ランニング、サイクリングと相性がよい。", evening: "駅前は明るいが、利用路線から自宅までの実際の距離を夜に歩きたい。" },
    yokohama: { cost: "出口・川・幹線道路を越えるかで物件条件が変わる。駅までの実歩分数と管理費を確認。", car: "横浜駅西口出入口など高速アクセスは強いが、渋滞と駐車場費が課題。", outdoors: "港・みなとみらい方面の散歩や夜景へ出やすい。駅直近は人通りが多い。", evening: "飲食・娯楽は豊富。繁華街を通る帰宅路と静かな住宅側を分けて見る。" }
  };

  const tagAdditions = {
    oimachi: ["central", "shinkansen", "walk", "cycle", "late", "racecourse"], omori: ["expressway", "walk", "river", "cycle", "car"],
    kamata: ["affordable", "drinks", "late", "river", "cycle", "expressway", "car"], osaki: ["central", "shinkansen", "walk"],
    gotanda: ["central", "drinks", "late", "river"], musashikoyama: ["walk", "cycle"], togoshiginza: ["walk", "affordable"],
    nakanobu: ["affordable", "walk"], hatanodai: ["affordable", "walk"], ookayama: ["student", "walk"],
    jiyugaoka: ["drinks", "walk"], "keikyu-kamata": ["shinkansen", "affordable", "expressway", "car", "cycle"],
    kawasaki: ["central", "affordable", "drinks", "late", "racecourse", "river", "expressway", "car", "cycle"],
    musashikosugi: ["central", "river", "walk", "cycle"], yokohama: ["central", "shinkansen", "drinks", "late", "sea", "view", "walk", "expressway", "car"]
  };

  const tagLabels = {
    multi: "複数路線", central: "都心へ出やすい", airport: "羽田へ出やすい", shinkansen: "新幹線へ出やすい",
    shopping: "駅前で買い物", street: "商店街", books: "本・文化", affordable: "費用を比較しやすい",
    park: "大きな公園", river: "川・河原", walk: "散歩向き", cycle: "長距離自転車", bike: "日常の自転車",
    sea: "海・港へ", view: "水辺・夜景", car: "車の動線も検討", expressway: "高速入口方面",
    quiet: "住宅地へ切替", family: "家族の生活動線", late: "夜遅くも用事", drinks: "飲食・酒場", student: "学生街の要素", racecourse: "競馬場方面", night: "夜も動く街"
  };

  const filterGroups = [
    { id: "transport", label: "移動", note: "通勤以外の遠出も含める", tags: ["multi", "central", "airport", "shinkansen"] },
    { id: "daily", label: "日常と費用", note: "買い物と住居費の比較軸", tags: ["shopping", "street", "books", "affordable", "family"] },
    { id: "outdoors", label: "外で過ごす", note: "散歩・自転車・水辺", tags: ["park", "river", "walk", "cycle", "sea", "view"] },
    { id: "mobility", label: "車・自転車", note: "所有しやすさではなく動線の候補", tags: ["bike", "car", "expressway"] },
    { id: "evening", label: "夜と休日", note: "店、人通り、遊び方", tags: ["quiet", "late", "drinks", "student", "racecourse"] }
  ];

  const themePresets = [
    {
      id: "weekend-mobility",
      navLabel: "週末に遠くへ",
      label: "平日は都心、休日は遠くへ出たい",
      title: "週末に都市を出る人の街探し",
      description: "通勤だけでなく、羽田・新幹線・高速道路や川沿いへの動き方まで重ねて、休日の起点になる街を探します。",
      tags: ["airport", "shinkansen", "expressway"],
      matchMode: "any",
      criteria: ["平日の都心アクセス", "羽田・新幹線・高速道路へのつながり", "川・海・自転車など休日の外出"]
    },
    {
      id: "car-life",
      navLabel: "車を使う",
      label: "車を持つ、またはカーシェアを使いたい",
      title: "車を使う人の街探し",
      description: "駅前の便利さだけでなく、幹線道路や高速入口方面へ出る動線と、車なしの日常がどう両立するかを見ます。",
      tags: ["car", "expressway"],
      matchMode: "any",
      criteria: ["幹線道路・高速入口方面への動線", "駅前道路と住宅街の走りやすさ", "鉄道・徒歩と車の使い分け"]
    },
    {
      id: "riverside",
      navLabel: "川・公園・自転車",
      label: "川・公園・自転車のある生活がしたい",
      title: "外を歩き、走り、漕ぐ人の街探し",
      description: "河川敷、公園、海辺、散歩道、自転車でつながる場所から、家の外で過ごしやすい生活圏を探します。",
      tags: ["river", "park", "sea", "view"],
      matchMode: "any",
      criteria: ["日常の散歩先", "河川敷・公園・海辺への距離", "長く走れる自転車動線"]
    },
    {
      id: "books-culture",
      navLabel: "本・文化",
      label: "本屋・図書館・文化施設に寄りたい",
      title: "本と文化の近くで暮らす街探し",
      description: "大型書店だけでなく、図書館、大学、商店街や周辺駅への行きやすさを含めて、本のある日常を見ます。",
      tags: ["books", "student"],
      matchMode: "any",
      criteria: ["本屋・図書館・大学などの文化拠点", "帰宅途中に立ち寄れる日常動線", "周辺の大きな街への短距離アクセス"]
    },
    {
      id: "night-life",
      navLabel: "夜の生活",
      label: "夜遅くまで食事や買い物を済ませたい",
      title: "夜の帰宅まで考える街探し",
      description: "夜まで使える店の多さだけでなく、飲食街、駅から住宅側への切り替わり、実際の帰宅路を見ます。",
      tags: ["late", "drinks", "night"],
      matchMode: "any",
      criteria: ["遅い時間の買い物と食事", "飲食街と住宅側の距離", "夜に歩く帰宅経路"]
    },
    {
      id: "family-daily",
      navLabel: "家族の日常",
      label: "家族の日常動線を優先したい",
      title: "家族の一日から考える街探し",
      description: "買い物、公園、自転車、静かな住宅側への切り替わりから、家族で動く一日の組み立て方を見ます。",
      tags: ["family", "quiet", "park"],
      matchMode: "any",
      criteria: ["買い物と通学・送迎の動線", "公園と日常の自転車移動", "駅前から住宅地への切り替わり"]
    }
  ];

  const enrichedStations = stations.map((station) => ({
    ...station,
    ...(stationProfiles[station.slug] || {}),
    tags: [...new Set([...station.tags, ...(tagAdditions[station.slug] || [])])],
    practical: practicalNotes[station.slug],
    editorialStatus: "試作調査・2026年9月"
  }));

  return { stations: enrichedStations, sources, tagLabels, filterGroups, themePresets };
})();

export { ATLAS_DATA };
