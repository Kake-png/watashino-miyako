# 路線の全区間描画（v54）

国土交通省「国土数値情報 鉄道データ（2025年度）」の全国データを加工。
https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-2025.html
原データ: https://nlftp.mlit.go.jp/ksj/gml/data/N02/N02-25/N02-25_GML.zip
利用条件: CC BY 4.0。地図の帰属表示に原典へのリンクを維持。

駅掲載範囲のbboxによる切断を廃止。表示処理は接続する線分の結合のみを行い、枝線・環状線・端部を落とさない。JRの運行系統は正式線名の単純な全件抽出ではなく、公式路線図の通過駅を指定して線路データ上の連続経路を抽出する。駅ホーム付近の並行線は前後の接続を含めて選ぶ。路線の選択状態にかかわらず、駅候補の掲載範囲は15駅のまま。

## 描画する範囲

- 京浜東北・根岸線: 大宮〜東京〜横浜〜磯子〜大船
- 山手線: 品川〜新宿〜池袋〜田端〜東京〜品川の一周
- 埼京線: 大崎〜新宿〜赤羽〜武蔵浦和〜大宮
- 湘南新宿ライン: 小田原〜大船〜新宿〜高崎〜前橋、および逗子〜大船〜新宿〜大宮〜宇都宮
- 東海道線: 東京〜熱海（JR東日本の掲載系統）
- 横須賀線: 東京〜武蔵小杉〜大船〜久里浜
- 南武線: 川崎〜立川と尻手〜浜川崎の支線
- 大井町線: 大井町〜溝の口（田園都市線と共用する二子玉川〜溝の口を含む）
- 池上線: 五反田〜蒲田、多摩川線: 多摩川〜蒲田
- 目黒線: 目黒〜日吉（東横線と共用する田園調布〜日吉を含む）
- 東横線: 渋谷〜横浜
- 京急本線: 泉岳寺〜浦賀、空港線: 京急蒲田〜羽田空港第1・第2ターミナル
- 浅草線: 西馬込〜押上、りんかい線: 大崎〜新木場
- 相鉄本線: 横浜〜海老名、ブルーライン: 湘南台〜あざみ野

直通先の路線すべてを一つの色に延長するものではない。埼京線の川越線・りんかい線・相鉄線等への直通先、横須賀線の総武快速線への直通先、東横線のみなとみらい線への直通先は、各路線そのものと区別する。中央線2系統は掲載駅がないため選択不可のまま。

運行系統の確認先: https://www.jreast.co.jp/map/pdf/map_tokyo.pdf 、https://www.tokyu.co.jp/railway/om/ 、https://www.tokyu.co.jp/railway/ 、https://www.keikyu.co.jp/ride/kakueki/

## 再生成

ZIPのUTF-8版のRailroadSection/Station shapefileをGeoJSONへ変換する（QGIS等。Pythonならpyshpで各shape.__geo_interface__とrecord.as_dict()をFeatureにする）。外部データはZIPに同梱しない。線路・駅の両方を同じ年度で用意する。

```
python3 scripts/extract-route-geometry.py SECTIONS.geojson STATIONS.geojson
npm run routes:display
npm run build
npm run check
```

抽出範囲の定義は `scripts/route-scope.json`。抽出はPython標準ライブラリのみ。行先・路線構造に変更があれば定義と端部のテストを更新する。2025年の地理データのため、それ以降の新線・工事による線形変化をリアルタイムには反映しない。
