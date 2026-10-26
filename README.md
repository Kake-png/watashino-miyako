# 街えらび案内所 — v42

このサイト用のGA4測定IDを設定しました。公開後、ページ下部の「解析を許可」を選び、GA4のリアルタイムで受信を確認してください。自分の通常ブラウザは「解析を拒否」を選べば計測されません。広告・連絡先は引き続き未設定です。

# 街えらび案内所 — v41

計測・収益化の設定口を追加。初期状態では広告も解析も無効です。設定は docs/monetization-setup.md、残作業は docs/release-status.md を参照。30テスト・50HTML・再ビルド一致を確認。

# 街えらび案内所 — v40

名称・サイト説明・SEOの仕上げを反映。詳細と公開後の作業は docs/seo-status.md。npm run check は28テストと50HTMLの検証を行います。

# v39・調査結果反映（2026-10-24）

全270条件を最新の採用表へ更新。該当193・調査範囲で条件外77。夜景は水辺限定を撤回し7駅、サイクリングは長い整備道へ15分以内の4駅を採用。

駅追加は research/station_expansion/STATION_RESEARCH_PROMPT.md を使用。

# 駅まち図譜 — v38

暮らしの条件から住む駅の候補を探す静的サイト。2026年10月17日版。既存のCloudflare Workers/GitHub構成を維持しています。

## 今回の更新

- 15駅×18条件の監査表をサイトの唯一の判定元へ接続
- 確認済みの該当だけを検索・地図・暮らし別入口へ反映。条件外と確認待ちは別の状態を維持
- 全15駅の1K参考相場・駅別出典・確認日・同一の算出方法を反映
- 比較表を交通・家賃・18条件で統一し、詳しい理由は開いて読める表示に変更
- JavaScriptなしでも駅の根拠を読める本文、全駅×全条件の確認表 `/data-status/`
- 空港バスの少便・改札内店舗・公園の制限・閉館情報を説明に反映
- 対象が0駅のテーマは機能を維持し、noindexとsitemap除外で扱う
- 再ビルドで監査CSVからデータを再生成し、古いタグを再採用しない

白地と既存の配色・地図を維持しています。

## 完成状況

正式完成とは扱っていません。残る129件の条件確認、公開連絡先、実機・公開環境の確認が残っています。家賃の個別出典と算出方法は今回確認しました。

`docs/release-status.md` が残作業、`docs/data-audit.md` が実データから生成する確認状況です。

## 展開・更新

ZIP内の `package.json`、`scripts`、`templates`、`public` をリポジトリ直下に配置します。`source/public` のように一段深く入れないでください。

既存の `.git` と自身の設定・未コミットの作業は保持してください。全消去や `git rm -r -- .` は不要です。ZIPには秘密情報、node_modules、写真の調査キャッシュ、以前の配布ZIPを含めていません。

```bash
npm ci
npm run build
npm run check
git status --short
git ls-files --error-unmatch public/assets/data.js
```

新しいファイルが未追跡の場合は、内容を確認してから `git add -A`、コミット、pushを行ってください。

Cloudflareの設定：

- ルートディレクトリ：リポジトリ直下
- ビルド：`npm ci && npm run build`
- デプロイ：`npx wrangler deploy`
- Node.js：22.22.2以上の22系、24.15以上の24系、または26以上（検証環境は24）

公開後に `/deployment-version.txt` の `ekimachi-zufu-v38` と `/release.json` を確認します。

## 開発・検証

```bash
npm ci
npm run build
npm run check
python3 -m http.server 4173 --directory public
```

`npm run check` はデータ、50 HTMLページのリンク、テンプレート残り、canonical、JSON-LDと、監査データ連携・検索・DOM操作の23テストを実行します。jsdomテストは実ブラウザのCSSレイアウト・OSMの外部タイル通信を保証しません。

2026年10月14日の `npm audit` は0件です。

## 更新するファイル

- 駅本文・路線・従来のタグ：`public/assets/data.js`
- 条件の判定元：`research/audit/condition_records_merged.csv`
- 利用者向けの根拠説明：`research/audit/public_notes.csv`
- 判定基準：`research/audit/criteria.csv`
- 家賃：`research/audit/rent_review.csv`
- 生成物：`public/assets/audit-data.js`（直接編集しない）
- 共通検索ルール：`public/assets/search.js`
- 駅ページ：`templates/station.html` と `public/assets/app.js`
- CSS：`public/assets/style.css`、`public/assets/interface-v34.css`

確認済みには、具体的な対象・判定値・出典・確認日が必要です。推測やAI文章だけでタグを増やさないでください。

写真はWikimedia Commons画像を使用し、作者・撮影時期・ライセンス・出典・変更内容を表示します。CC BY-SA加工版は同じライセンスです。写真なしでも駅ページは成立します。

## ZIPの再生成

```bash
npm run package
```

必要なソースと公開ファイルだけをZIPにまとめます。旧 `cloudflare-upload.zip` は利用しません。既存の出力ZIPがある場合は上書きせず停止します。

ドメインを変える場合は、ビルド時の環境変数 `SITE_ORIGIN` を設定するとcanonical・OGP・sitemapが統一されます。
