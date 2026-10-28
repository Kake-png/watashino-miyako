import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ATLAS_DATA as data} from '../public/assets/data.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ledger=JSON.parse(fs.readFileSync(path.join(root,'research/station-ledger.json'),'utf8'));
const stages=['候補','追加予定','調査中','確認待ち','掲載準備済み','収録済み','保留','対象外'];
const ids=new Set();
const inventory=JSON.parse(fs.readFileSync(path.join(root,'research/tokyo-station-inventory.json'),'utf8'));
const groupCodes=new Set();
for(const row of ledger.stations){
 if(!row.id||ids.has(row.id))throw Error(`Duplicate or missing station ID: ${row.id}`);
 ids.add(row.id);
 if(row.inventoryGroupCode){if(groupCodes.has(row.inventoryGroupCode))throw Error(`Duplicate source group: ${row.id}`);groupCodes.add(row.inventoryGroupCode);}
 if(!stages.includes(row.status))throw Error(`Unknown status: ${row.id}`);
 if(['保留','対象外'].includes(row.status)&&!row.reason)throw Error(`Decision needs a reason: ${row.id}`);
 const station=data.stations.find(s=>s.slug===row.id);
 if(row.status==='収録済み'&&!station)throw Error(`Ledger claims an unlisted station is included: ${row.id}`);
 if(station&&(row.status!=='収録済み'||row.conditionCount!==18||row.photoCount!==station.images.length||!fs.existsSync(path.join(root,row.contentPath||'missing'))))throw Error(`Station ledger is stale: ${row.id}`);
}
for(const record of inventory.stations)if(!groupCodes.has(record.groupCode))throw Error(`Untracked Tokyo inventory group: ${record.groupCode}`);
for(const station of data.stations)if(!ids.has(station.slug))throw Error(`Untracked station: ${station.slug}`);
const escape=v=>String(v??'未確認').replaceAll('|','／').replaceAll('\n',' ');
const included=ledger.stations.filter(s=>s.status==='収録済み');
const pending=ledger.stations.filter(s=>s.status!=='収録済み');
const md=`# 駅の追加・調査台帳\n\n更新: ${ledger.updatedAt}。正本は同じフォルダの station-ledger.json。この一覧は npm run stations:ledger で再生成。\n\n**収録済み ${included.length}駅／候補等 ${pending.length}駅、計${ledger.stations.length}件。**\n\n${ledger.coverageClaim}\n\n母集団の出典・原典駅コード・事業者・路線は tokyo-station-inventory.json に収録。鉄道データの基準日は2025年12月31日、東京都境界は2025年1月1日。線形が東京都と交差する駅を抽出し、同名300m以内の原典グループで整理。現在の営業や掲載要否は未確認です。\n\n${ledger.allStationsPolicy}\n\n## 収録済み\n\n「完了」は調査とソースへの収録まで。本番反映を保証する状態ではありません。\n\n|駅ID|駅|地域|18条件|写真|状態|\n|---|---|---|---|---|---|\n${included.map(s=>`|${s.id}|${s.name}|${s.prefecture}・${s.area}|${s.conditionCount}/18|${s.photoCount}枚|${s.status}|`).join('\n')}\n\n## 追加候補・予定・保留\n\n第1候補群の4駅を含め、追加順の提案段階です。「候補」を追加決定と扱わず、着手を決めた駅だけ「追加予定」に変更します。\n\n|駅ID（暫定）|駅|都県|候補群|状態|選ぶ理由・保留理由|\n|---|---|---|---|---|---|\n${pending.map(s=>`|${[s.id,s.name,s.prefecture,s.group,s.status,s.reason].map(escape).join('|')}|`).join('\n')}\n\n## 状態の使い方\n\n候補 → 追加予定 → 調査中 → 確認待ち → 掲載準備済み → 収録済み。保留・対象外も理由を付けて残し、行は消さない。条件の該当／非該当とは別の管理です。\n\n調査中は取得済み条件数と写真数を更新し、中断時はnotesに不足項目と結果ファイルの場所を残します。収録済みへ進める時は駅データ・写真・ページの実体を照合します。\n\n## 全域を目指す時の取りこぼし対策\n\n- 母集団は国土数値情報から作成済み。現行営業の照合時は事業者公式の駅一覧を使い、原典以降の開業・廃止・改称を反映する。出典URL・取得日・原典駅コードを保持し、基準日後も全件確認済みとは扱わない。\n- まず東京23区・多摩・島しょ等の地域別に母集団の取得状況を確認する。神奈川等の隣接県は別範囲とし、現状の掲載駅は維持する。鉄道データに駅がない自治体も、未調査と駅未収録を区別する。\n- 同名別駅は地域・事業者と公式駅コードで区別。同一駅の複数事業者は照合表で関連付け、別駅を徒歩圏という理由だけで統合しない。田町と三田等の近接駅は別IDのまま関連付ける。\n- 母集団の駅ごとに詳細ページの要否を判断する。「未判断」「掲載対象」「保留」「対象外」を分け、理由を残す。似た街・施設不足だけで自動的に対象外にはしない。\n- 開業・廃止・改称時は母集団と台帳を照合。旧ID・別名は履歴として残し、重複追加や調査のやり直しを避ける。\n\n## 更新コマンド\n\n台帳JSONを更新 → npm run stations:ledger（整合性検査と一覧再生成）。検査だけなら npm run stations:check。駅を追加した際に台帳の更新漏れがあれば検査で止まります。\n`;
const target=path.join(root,'research/STATION_LEDGER.md');
if(process.argv.includes('--check')){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==md)throw Error('Run npm run stations:ledger to refresh the station list');}
else fs.writeFileSync(target,md);
console.log(`Station ledger OK: ${included.length} included, ${pending.length} tracked candidates/other states`);
