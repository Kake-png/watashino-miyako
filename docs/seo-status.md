# 2026-10-27 の公開サイト確認

公開版v54のトップ・大崎駅・robots.txt・sitemap.xmlを直接取得しHTTP 200を確認。robotsはAllow:/とサイトマップ参照あり、サイトマップ50URL。トップのcanonicalは本番URL・robotsはindex,follow。大崎駅ページは静的HTMLにh1と理由・出典の本文あり。

今回のv56では☆保存機能を追加。保存状態の組み合わせごとにSEOページを増やさず、既存の駅・テーマページを検索入口として維持する。

Search Consoleの検証コードは未設定だが、別方式の確認状況は不明。Googleの登録状況・表示回数・クリック数・検索語・平均順位は未取得。公開サイトが取得できることはGoogleへの登録・上位表示の保証ではない。次回は所有権確認済みのSearch Consoleプロパティで状況を確認する。

# SEO対応状況 — v40 / 2026-10-25

ソース側のSEO整備を完了。検索順位・検索結果の文言やインデックス登録を保証する意味ではない。

## 実装と検証

- 全公開ページ・JavaScriptで変更されるページタイトルを「街えらび案内所」に統一。
- トップに駅の特徴から街を探すサービスであることを明記。
- 駅ページのタイトルに「住みやすさ・街の特徴」を明記。記載本文に沿った説明文を設定。
- 駅・テーマ・路線ごとに固有のタイトルと説明文。HTMLに本文・駅リンク・根拠・写真のalt・寸法が存在し、検索操作をしなくても読める。
- canonical、OGP URL、構造化データ、サイトマップのURLを同一のSITE_ORIGINに統一。絞り込みクエリは別の掲載ページとしてサイトマップに増やさない。
- トップのWebSite構造化データの名称は説明文を混ぜず正式名称のみ。駅ページのパンくず構造化データを維持。架空の口コミ・星評価・企業情報は追加しない。
- OGP画像（1200×630 PNG）、サイト名・日本語ロケール・画像代替文、Xの大型カード設定。
- 比較ページ・候補ゼロのテーマ・404はnoindex。サイトマップはインデックス対象のみ。robots.txtでは本文やCSS・JSを遮断しない。
- 写真の遅延読み込み・寸法指定、ローカルLeaflet配布、既存キャッシュ方針を維持。
- 28テスト、50HTMLのリンク・メタデータ検査、再ビルドで101公開ファイルの一致を確認。

## 公開後に実施すること

1. このZIPのソースを本番へ反映。既存URLは維持しており、Worker名やドメインは勝手に変更していない。
2. 実際のURLでトップ・駅ページ・404のHTTPステータス、robots.txt・sitemap.xml、canonicalを確認。未知URLが200のトップページになる配信設定は避ける。
3. 本番のモバイル表示・地図タイル・Lighthouse/PageSpeed、実測Core Web Vitalsを確認。ローカル検査から性能スコアは断定しない。前回プレビューでOSM背景タイル403があり、本番での確認が必要。
4. Search Consoleで既存の公開URLを所有確認し、/sitemap.xmlを送信。URL検査・構造化データ検査・インデックス状況を確認。
5. 運営者が公開してよい連絡先を決定して掲載。現在の連絡先を推測して追加しない。

独自ドメインを使う場合は公開前にSITE_ORIGINを設定して再ビルドし、旧URLからのリダイレクトも合わせて設定する。現時点で移行は実施していない。

## 判断の参照資料

- https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ja
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/robots/intro

## 継続更新

駅の追加は調査CSV・データ更新からビルドし、npm run checkを実行。公開日のみを理由に全URLのlastmodを更新しない。掲載情報の実際の変更日を管理できるまではサイトマップにlastmodを付けない。
