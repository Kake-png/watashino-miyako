# 駅の写真収集

v54では23枚を追加し、全15駅で各3枚以上、出典キー計50枚。各画像の作者・ライセンス版とURL・撮影日・Commonsファイルページ・加工内容を写真の下に表示する。古い写真は撮影時点の記録として扱う。

一括調査には `research/station_expansion/STATION_RESEARCH_PROMPT.md` を使用する。18条件・プロフィール・家賃・写真を一度に依頼し、写真は3〜5枚を目標とする。キットの条件CSV形式は変更していない。

新しい写真は `scripts/commons-photo-manifest.json` にkey/station/title/alt/captionを追加。画像・権利・場所を確認した新規写真だけinclude:trueとする。従来行は旧設定のままで、自動再取得による置換対象にしない。現在の`public/assets/data.js`に保持される原出典と差がある旧manifest行は、再取得前に現行出典へ照合すること。

```
node scripts/fetch-commons-photos.mjs new-photo-key
npm run photos:sync
npm run build
npm run check
```

fetchは画像とメタ情報の取得まで。syncはinclude:trueの確認済み写真をphoto-additions.jsへまとめ、データが駅別写真に統合される。原ファイルやAPI応答が取得できない場合は未取得として扱う。タイトルの推測で画像を採用しない。Commons APIで作者や撮影日の機械可読項目が欠ける場合は、実際のFileページで確認してメタ情報へ記録する（v54の戸越銀座2005年写真は作者Kentin・2005年8月を本文で確認）。写真のURLが同じものは別キーでも重複させない。変換後の画像も開いて検証する。
