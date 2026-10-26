# 計測・収益化の準備 v42

GA4はこのサイト用のG-H94HSFCFJEを設定済み。許可後にだけ読み込む。AdSense・店舗広告は無効。別サイトのIDは流用していない。

## 運営者が決めること

1. 独自ドメインを取得してCloudflareの既存Workerへ接続。ビルド環境のSITE_ORIGINを新しいHTTPS originにする。旧URLから同じパスへ301転送する設定はドメイン確定後に実施する。現時点では未移行。
2. このサイト用のGA4ウェブストリームを作り、scripts/site-settings.json のgaMeasurementIdへG-から始まるIDを入力。自己アクセスは自身のブラウザで「解析を拒否」。端末・ブラウザが異なる場合はそれぞれ設定する。localhostも除外。GA4のリアルタイムで計測確認する。
3. Search ConsoleはドメインプロパティのDNS所有確認を推奨。URLプレフィックスでHTMLメタ認証する場合はsearchConsoleVerificationにトークンを入力。sitemap.xml送信・トップと駅ページをURL検査。
4. 公開してよい連絡先をcontactEmailに入力すると、全ページ下部に問い合わせ・広告相談のメールリンクが表示される。未設定なら非表示。
5. AdSense申請時はadsensePublisherIdにca-pub-から始まるIDを入力。所有確認用メタタグのみ追加し、広告配信スクリプトは追加しない。審査後に広告枠・ads.txt・同意管理と実際の取扱いに合うプライバシー記載を実装する。審査通過を保証しない。

## 店舗広告

同じ設定ファイルのsponsors配列へ次の形で登録する。

```json
{"station":"oimachi","name":"店舗名","description":"契約済みの紹介文","url":"https://店舗の公式URL/","start":"2026-11-01","end":"2026-11-30"}
```

stationは駅slug。HTTPS・掲載期間・実在する掲載駅をビルド時に検査。HTMLはエスケープする。駅ページ本文の後、フッターの前に広告ラベル付きで表示。地図や条件判定は変えない。空配列では空き枠も表示しない。
掲載期間はビルド日（UTC）で判定する静的配信。終了日翌日までに必ず再ビルド・公開すること。自動決済・自動更新・広告管理画面は設けていない。

営業前には駅別の閲覧数を測り、期間・料金・掲載内容・修正回数・解約条件を決める。現状のアクセス実績や効果を捏造せず、料金はまだ公開しない。広告募集ページは連絡先と契約条件が固まってから公開する。

## 検証と公開

npm run build、npm run check。今回のZIPを既存GitHubリポジトリへ展開してビルド・公開する。本番への反映とアカウント側の操作は未実施。v42のdeployment-version.txtで反映を確認する。

参考：Google基本同意モード https://developers.google.com/tag-platform/security/guides/consent
AdSense接続 https://support.google.com/adsense/answer/7584263?hl=ja
