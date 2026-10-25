"""駅別一括調査の入力生成と返却形式検査。ネット調査・公開は行わない。"""
import argparse
import csv
import json
from datetime import date
from pathlib import Path

BASE = Path(__file__).resolve().parent

def read(path):
    with Path(path).open(encoding='utf-8-sig', newline='') as f:
        r = csv.DictReader(f)
        cols, rows = r.fieldnames, list(r)
    if not cols or len(cols) != len(set(cols)):
        raise ValueError('列名が空または重複')
    if any(None in r or any(v is None for v in r.values()) for r in rows):
        raise ValueError('CSVの列数不一致')
    return cols, rows

def write(path, cols, rows):
    with Path(path).open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('command', choices=['make', 'check'])
    ap.add_argument('--stations', type=Path, required=True)
    ap.add_argument('--out', type=Path)
    ap.add_argument('--result', type=Path)
    args = ap.parse_args()
    _, stations = read(args.stations)
    if not stations or any(not r.get('station_slug', '').strip() or not r.get('station_name', '').strip() for r in stations):
        ap.error('駅のslugと名前が必要')
    if len({r['station_slug'] for r in stations}) != len(stations):
        ap.error('駅slugの重複')
    _, rules = read(BASE / 'criteria.csv')
    schema = json.loads((BASE / 'result_schema.json').read_text())
    expected = {}
    for s in stations:
        for c in rules:
            key = s['station_slug'] + '::' + c['condition_id']
            expected[key] = dict(record_id=key, station_slug=s['station_slug'], station_name=s['station_name'], condition_id=c['condition_id'], condition_label=c['label'])
    if args.command == 'make':
        if args.out is None:
            ap.error('--outが必要')
        args.out.mkdir(parents=True, exist_ok=True)
        rows = []
        for v in expected.values():
            row = dict.fromkeys(schema['columns'], '')
            row.update(v, research_status='未着手', research_judgment='未確認')
            rows.append(row)
        write(args.out / 'input_template.csv', schema['columns'], rows)
        prompt = (BASE / 'STATION_RESEARCH_PROMPT.md').read_text()
        prompt = prompt.replace('ここを駅名一覧で置換。例：三田駅（東京都・都営）、田町駅（東京都・JR）。同名駅の混同を避け都道府県・事業者を記す。複数駅を改行で列挙可。', '\n'.join('- '+s['station_name']+' / slug: '+s['station_slug'] for s in stations))
        (args.out / 'REQUEST.md').write_text(prompt)
        print(json.dumps({'stations':len(stations), 'expected_rows':len(expected), 'output':str(args.out)}, ensure_ascii=False))
        return
    if args.result is None:
        ap.error('--resultが必要')
    cols, rows = read(args.result)
    issues = []
    if cols != schema['columns']:
        issues.append('17列の列順・列名不一致')
    seen = set()
    for row in rows:
        key = row.get('record_id', '')
        if key in seen:
            issues.append(key+': ID重複')
        seen.add(key)
        if key not in expected:
            issues.append(key+': 対象外ID')
            continue
        if any(row.get(c) != v for c, v in expected[key].items()):
            issues.append(key+': 駅または条件の不一致')
        judgment = row.get('research_judgment')
        if judgment not in schema['judgments']:
            issues.append(key+': 判定値不正')
        if row.get('research_status') != '調査済み':
            issues.append(key+': 未処理')
        if judgment == '該当' and any(not row.get(c, '').strip() for c in ['target_name','measurements','method_and_route','source_urls','research_checked_at']):
            issues.append(key+': 採用根拠の不足')
        if judgment == '非該当' and not row.get('negative_search_scope', '').strip():
            issues.append(key+': 探索範囲なし')
        if judgment == '未確認' and not row.get('unresolved_points', '').strip():
            issues.append(key+': 不足点なし')
        if row.get('research_checked_at'):
            try:
                date.fromisoformat(row['research_checked_at'])
            except ValueError:
                issues.append(key+': 日付形式不正')
    issues += [k+': 行欠落' for k in sorted(set(expected)-seen)]
    print(json.dumps({'expected_rows':len(expected), 'received_rows':len(rows), 'format_valid':not issues, 'issues':issues, 'factual_verification':False}, ensure_ascii=False, indent=2))
    if issues:
        raise SystemExit(1)

if __name__ == '__main__':
    main()
