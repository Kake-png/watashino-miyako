# 駅追加調査キット

利用者の作業は、STATION_RESEARCH_PROMPT.mdの【対象駅】に駅名を一つ、または複数書いて一度依頼するだけです。
同じ会話なら「このキットの手順で、○○駅・△△駅を追加調査して」で構いません。別のAIにはこのフォルダを渡します。

返却はstation_research_result.csv一つ、駅数×18行。現在の公開用ソースへ自動反映はしません。
条件別に18回依頼する必要はありません。内部のWeb検索・資料閲覧は複数回必要で、一回の検索リクエストだけで全条件を保証する意味ではありません。

複数駅は同じ地域・路線の数駅をまとめると、施設・路線資料を再利用しやすくなります。1駅版も複数駅版も同じプロンプトです。規模上限は固定せず、ツール容量に応じ内部で小分けしても最終出力は全体一つにまとめます。

## 利用するもの

- STATION_RESEARCH_PROMPT.md：基準18件を内蔵した単独で使える依頼文。
- criteria.csv：同じ基準の構造化データ。
- known_station_evidence.csv：既存270行の採用根拠。既知施設の再利用用。新駅のアクセスは別に調べる。
- result_schema.json：返却CSVの列・値。
- batch_tools.py：任意の入力テンプレート生成・返却形式検査。実調査や真偽判定はしない。

## 開発側の任意コマンド

python3 batch_tools.py make --stations stations.csv --out batch
python3 batch_tools.py check --stations stations.csv --result station_research_result.csv

stations.csvはstation_slug,station_nameの2列。例：mita-tokyo,三田（東京都・都営）。makeは18×Nの入力枠と依頼文を生成します。
checkは新駅にも対応します。既存270行へのID一致を要求する旧research_managerのcheck-returnへ、新駅の結果をそのまま渡さないでください。

採用前には開発側が根拠との対応と形式を点検します。全件を別AIへ再提出したり、全URLを意味なく再取得したりせず、矛盾・根拠不足・期限切れ等の行だけ確認します。既存マスターへの新駅登録と公開用反映は別工程です。

## v2: 写真・掲載情報まで一括

現行プロンプトは18条件CSVに加え、掲載プロフィール、1K参考相場、各駅3〜5枚を目標とする写真と権利情報まで同時に返します。CSVの17列は従来どおりで、プロフィールと写真は別JSONです。写真が足りなければ不足理由を記録し、条件調査全体を未完了にはしません。
