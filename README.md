# 駅まち図譜（仮）— Cloudflare試作版

物件ではなく、駅と街の生活条件から住む場所を探す静的Webサイトです。ユーザー投稿、会員機能、物件データベースは入れていません。

## 収録内容

- 南東京〜横浜の候補駅 15駅
- 15駅すべての街ガイド
- 出典とライセンスを個別確認した街写真 27点
- 地図検索、生活条件フィルター、駅詳細、最大3駅の比較、写真クレジット
- 同じ地図を異なる初期条件で開く、6種類の「暮らしの視点」
- 住居費の見方、車・高速道路、散歩・自転車、水辺、夜の帰宅を含む比較軸

## 暮らしの視点

テーマページは別のデータベースや別サイトではありません。共通の駅・写真・条件データを使い、初期選択する条件、説明文、地図上の強調、駅の表示順だけを切り替えます。テーマを選ばず全駅から探すことも、開いた後に条件を外す・追加することもできます。

- `/themes/weekend-mobility/`
- `/themes/car-life/`
- `/themes/riverside/`
- `/themes/books-culture/`
- `/themes/night-life/`
- `/themes/family-daily/`

写真はWikimedia CommonsのCC0、CC BY、CC BY-SA画像のみを使用しています。作者、撮影時期、ライセンスURL、元ページ、変更内容は `public/assets/data.js` にまとめ、サイト内の写真直下と `/about` に表示します。CC BY-SA写真の加工版は元写真と同じライセンス条件で提供します。

## ローカル確認

```bash
cd town-atlas
npm ci
npm run build
npm run check
python3 -m http.server 4173 --directory public
```

ブラウザで `http://localhost:4173/` を開きます。比較ページは `/compare/`、駅詳細は `/station/oimachi/` のように、ローカルとCloudflareで同じURLを使えます。

## Cloudflare Workersへ公開

このリポジトリは、`wrangler.jsonc` の Static Assets 設定によって `public` を配信します。Git連携では次の設定を使います。

- ビルドコマンド: `npm ci && npm run build`
- デプロイコマンド: `npx wrangler deploy`
- ルートディレクトリ: `/`
- Node.js: 20以上

手元から同じ設定で公開する場合は、次のコマンドを使います。

```bash
npm run deploy
```

公開後に `/deployment-version.txt` を開き、ZIPに記載されたバージョンが表示されれば、新しい静的アセットまで反映されています。

駅ページはビルド時に実体のあるHTMLとして生成します。`public/_headers` が基本的なセキュリティヘッダーと画像キャッシュを設定します。

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

1. `public/assets/data.js` に駅、本文、実用メモを追加する。
2. `research/STATION_RESEARCH_PROMPT.md` の形式で、事実と編集要約を分けて調査する。
3. 写真は元ページで作者・ライセンス・改変可否・商用利用可否を確認する。
4. Wikimedia Commons写真は `scripts/commons-photo-manifest.json` に登録し、`npm run photos:fetch` で取得する。
5. `npm run build && npm run check` を実行する。

基礎版は写真を必須にしません。既存写真が見つからない駅に、権利不明画像やGoogle Street Viewのスクリーンショットを置かないでください。

## 公開前に必ず直すもの

- 仮称「駅まち図譜」の名称・ドメイン・商標確認
- 駅本文の現地・一次情報によるファクトチェック
- 2019年以前に撮影された写真の差し替え候補を継続確認
- OpenFreeMapの利用量と運用方針を本番規模に合わせて再確認
- アクセス解析や広告を入れる場合のプライバシーポリシー整備

## 外部依存

- MapLibre GL JS 6.10.0（ビルド時にサイト内へ同梱）
- OpenFreeMap Liberty style
- OpenStreetMap data

地図が読み込めない場合も、駅一覧・駅本文・比較表・写真は利用できます。
