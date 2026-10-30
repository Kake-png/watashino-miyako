# machierabi-annaiへの移行手順

このZIPは新サイトのソースです。リポジトリのルートにpackage.json・wrangler.jsonc・public/が並ぶ形で配置します。サイト名は「街えらび案内所」、Worker・npm名はmachierabi-annai。新しい公開先の想定は https://machierabi-annai.kake-web.workers.dev/ です。未デプロイのため利用可能なURLと確定したわけではありません。

## 1. 旧Workerの自動デプロイを停止

旧WorkerがGit連携している場合、先にwatashino-miyako側の自動デプロイを停止・切断します。稼働中のサイト自体は残します。これから同じリポジトリの設定名を新Workerへ変えるためです。自動デプロイが残るとWorker名の不一致でビルドが失敗したり、後で転送コードが上書きされます。

## 2. GitHubリポジトリ名を変更

対象リポジトリのSettings → General → Repository nameをmachierabi-annaiにしてRename。ローカルでGitを使用している場合は、GitHubのCodeから新しいリポジトリURLをコピーして `git remote set-url origin 新URL`。ZIPをブラウザからアップロードする運用ならこのコマンドは不要です。

## 3. このZIPの内容を反映

新しいリポジトリへ展開内容を反映し、コミット・プッシュ。READMEだけではなく、public/、scripts/、templates/、package.json、package-lock.json、wrangler.jsonc等をまとめて更新します。ローカルの.gitは上書きしません。

## 4. 新しいWorkerを作成

CloudflareのWorkers & Pagesで新規Workerを作り、名前をmachierabi-annaiにします。Git連携の場合は改名後のリポジトリを接続。設定は以下。

- ルートディレクトリ：package.jsonとwrangler.jsoncがある場所（リポジトリ直下なら空欄／ルート）
- ビルドコマンド：npm run build
- デプロイコマンド：npx wrangler deploy
- Worker名：machierabi-annai（wrangler.jsoncのnameと一致させる）
- SITE_ORIGIN環境変数を以前設定していた場合：新しい公開URLへ更新するか削除。ソースの既定値は新URL。

CLIで公開する場合は、このソースのルートで `npm ci` → `npm run build` → `npm run check` → `npx wrangler deploy`。初回は自身のCloudflareアカウントへの認証が必要です。実際の本番変更はこの操作後に起こります。

新しいURLでトップ、駅詳細、地図・条件、☆保存、robots.txt、sitemap.xmlを確認します。ページソースのcanonicalも新URLにします（同梱ファイルは変更済み）。GA4測定IDは継続します。GA4管理画面のウェブストリームURLも新URLへ更新します。

## 5. 旧Workerを転送専用にする

新サイトが動くことを確認してから行います。旧Workerは削除せず、migration/old-worker/redirect.mjsの内容を旧Workerに配置します。Git自動デプロイが停止していることを確認してください。

CLIならプロジェクトのルートで次を実行します。

```
npx wrangler deploy --config migration/old-worker/wrangler.jsonc
```

このコマンドだけは旧名watashino-miyakoが対象です。新Workerの設定と混ぜないでください。旧Workerのダッシュボードでコードを直接編集できる場合はredirect.mjsの内容を置き換えてデプロイする方法でも構いません。

転送は301、駅ページのパスと検索条件のクエリを維持します。旧URLのトップと `/station/osaki/` がそれぞれ新URLの同じ場所へ移ることを確認します。

## 6. Search Console

新しいURLをURLプレフィックスとして追加し、HTMLタグを取得してサイトへ組み込みます。その後所有権確認→sitemap.xml送信。まだ登録前なので、旧URLへ確認タグを入れる必要はありません。

## 保存データについて

☆・比較候補・アクセス解析の拒否設定等はブラウザのオリジン単位です。新URLへ移ると旧URLの保存内容は自動的に引き継がれません。旧Workerへ戻すための再公開元として旧版ZIPは保管してください。
