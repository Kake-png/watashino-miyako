# 駅まち図譜 — Cloudflare Pages試作版

物件ではなく、駅と街の生活条件から住む場所を探す静的Webサイトです。ユーザー投稿、会員機能、物件データベースは入れていません。

## 収録内容

- 南東京〜横浜の候補駅 15駅
- 大井町・大森・蒲田の詳細版
- 出典とライセンスを個別確認した街写真 16点
- 地図検索、生活条件フィルター、駅詳細、最大3駅の比較、写真クレジット
- 写真がない駅も、地図・本文・徒歩圏の確認項目で成立する基礎版

写真はWikimedia CommonsのCC0、CC BY、CC BY-SA画像のみを使用しています。作者、撮影時期、ライセンスURL、元ページ、変更内容は `public/assets/data.js` にまとめ、サイト内の写真直下と `/about` に表示します。CC BY-SA写真の加工版は元写真と同じライセンス条件で提供します。

## ローカル確認

```bash
cd town-atlas
npm run check
python3 -m http.server 4173 --directory public
```

ブラウザで `http://localhost:4173/` を開きます。Pythonの簡易サーバーはCloudflareの `_redirects` を処理しないため、ローカルでは駅詳細を `station.html?slug=oimachi` のように確認してください。Cloudflare上では `/station/oimachi/` が使えます。

## Cloudflare Pagesへ公開

ビルドは不要です。公開ディレクトリは `public` です。

試しに直接アップロードする場合は、Cloudflare Dashboardの Workers & Pages から `public` フォルダまたはその中身をまとめたZIPをアップロードできます。Wranglerなら次のコマンドです。

```bash
npm run deploy
```

Cloudflareの現行仕様では、Direct Uploadで作ったPagesプロジェクトは後からGit integrationへ切り替えられません。継続運用する本番プロジェクトは、先にGit管理を始めてGit integrationで作る方が安全です。

`public/_redirects` が駅のクリーンURLを、`public/_headers` が基本的なセキュリティヘッダーと画像キャッシュを設定します。

## GitHubで管理する

このプロジェクトは最初からGit管理する前提で、`.gitignore`、`.gitattributes`、`.editorconfig`、GitHub Actionsの検証ワークフロー、Pull Requestテンプレート、訂正Issueテンプレートを含めています。

最初のリポジトリ作成例：

```bash
cd town-atlas
git init
git add .
git commit -m "Initial station atlas prototype"
git branch -M main
git remote add origin git@github.com:YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

GitHub Actionsは、駅データ・写真レジストリ・写真ファイルの対応を毎回確認します。写真や本文を変更した場合は、Pull Requestに根拠と出典を残してください。

## 駅と写真を追加する

1. `public/assets/data.js` の `stations` に駅を追加する。
2. 写真を使う場合は、元ページで作者・ライセンス・改変可否・商用利用可否を確認する。
3. WebP画像を `public/images/` に置き、同ファイルの `sources` に全クレジット項目を登録する。
4. 詳細版にする場合は `strengths`、`cautions`、`walk`、`notes`、`images` を追加し、`status` を `feature` にする。
5. `npm run check` を実行する。

基礎版は写真を必須にしません。既存写真が見つからない駅に、権利不明画像やGoogle Street Viewのスクリーンショットを置かないでください。

## 公開前に必ず直すもの

- `contact@example.com` を実在する訂正・権利窓口へ変更
- 仮称「駅まち図譜」の名称・ドメイン・商標確認
- 駅本文の現地・一次情報によるファクトチェック
- 古い写真の現況確認（特に2008年撮影の大森駅舎）
- OpenFreeMapの利用量と運用方針を本番規模に合わせて再確認
- アクセス解析や広告を入れる場合のプライバシーポリシー整備

## 外部依存

- MapLibre GL JS 6.10.0（unpkg配信）
- OpenFreeMap Liberty style
- OpenStreetMap data

地図が読み込めない場合も、駅一覧・駅本文・比較表・写真は利用できます。
