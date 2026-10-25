# サイトの判定元

`condition_records_merged.csv`：15駅×18条件の270行。research欄は受領した調査提案、review欄は開発側の検証結果。最初の22列を履歴として維持する。

`criteria.csv`：共通の条件。`policy_v1.md` と `policy_v1_1.md` は確定した補足。

`public_notes.csv`：検証済み該当に対応する、利用者向けの短い根拠。施設名や経路は raw の target_name と異なる場合があるため、古い候補名から説明を作り直さない。

`rent_review.csv`：全15駅の1K参考相場と各駅の出典・取得日時・算出方法。原サイトの全文・募集物件一覧は再配布しない。

npm run build でCSVを検査し、public/assets/audit-data.js と全ページを生成する。未確認の該当を検索タグへ混ぜない。条件外と確認待ちを区別する。公開済みデータの手修正ではなく、この判定元を更新する。
