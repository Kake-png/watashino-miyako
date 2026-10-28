"""Import MLIT N02 stations intersecting the Tokyo N03 polygons.
Usage: python3 scripts/import-tokyo-station-inventory.py N02_Station.shp TOKYO_N03.shp
Requires pyshp and shapely. Input datasets must match the documented source versions.
"""
import sys,pathlib,json,collections,hashlib
import shapefile
from shapely.geometry import shape
from shapely.strtree import STRtree
root=pathlib.Path(__file__).resolve().parent.parent
station_path,boundary_path=sys.argv[1:]
boundaries=[];areas=[]
for r in shapefile.Reader(boundary_path,encoding='utf-8').iterShapeRecords():
 p=r.record.as_dict()
 if p['N03_001']!='東京都':continue
 geom=shape(r.shape.__geo_interface__)
 if not geom.is_valid:geom=geom.buffer(0)
 boundaries.append(geom);areas.append(p['N03_005'] or p['N03_004'])
tree=STRtree(boundaries);groups={}
for r in shapefile.Reader(station_path,encoding='utf-8').iterShapeRecords():
 p=r.record.as_dict();geom=shape(r.shape.__geo_interface__)
 hits=tree.query(geom,predicate='intersects')
 if not len(hits):continue
 code=p['N02_005g'];row=groups.setdefault(code,dict(groupCode=code,names=set(),areas=set(),members=[]))
 row['names'].add(p['N02_005']);row['areas'].update(areas[int(i)] for i in hits)
 point=geom.interpolate(.5,normalized=True)
 row['members'].append(dict(stationCode=p['N02_005c'],name=p['N02_005'],operator=p['N02_004'],line=p['N02_003'],railwayType=p['N02_001'],lng=round(point.x,6),lat=round(point.y,6)))
records=[]
for r in groups.values():
 r['names']=sorted(r['names']);r['areas']=sorted(r['areas']);r['members']=sorted(r['members'],key=lambda m:(m['stationCode'],m['operator'],m['line']))
 records.append(r)
records.sort(key=lambda r:(r['areas'][0],r['names'][0],r['groupCode']))
meta=dict(importedAt='2026-10-27',railwayReferenceDate='2025-12-31',boundaryReferenceDate='2025-01-01',license='CC BY 4.0',publisher='国土交通省 国土数値情報',railwaySourceUrl='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-2025.html',boundarySourceUrl='https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2025.html',grouping='原典N02_005g（同名かつ300m以内をまとめる原典グループ）。サイト掲載単位の確定とは別。',spatialRule='駅の線形が東京都行政区域と交差するもの。自治体は線形との空間照合であり公式住所ではない。都境の駅は複数自治体になり得る。',limitations='原典基準日以降の新設・改称・廃止は別途照合。ケーブルカー等を含む。全件を詳細掲載するという決定ではない。',groupCount=len(records),memberCount=sum(len(r['members']) for r in records))
(root/'research/tokyo-station-inventory.json').write_text(json.dumps(dict(metadata=meta,stations=records),ensure_ascii=False,indent=2)+'\n')
ledger=json.loads((root/'research/station-ledger.json').read_text());rows=ledger['stations'];matched={r['inventoryGroupCode'] for r in rows if r.get('inventoryGroupCode')}
for row in rows:
 matches=[r for r in records if row['prefecture']=='東京都' and row['name'] in r['names']]
 if len(matches)==1:
  r=matches[0];row['inventoryGroupCode']=r['groupCode'];row['area']='・'.join(r['areas']);row['operators']=sorted({m['operator'] for m in r['members']});row['lines']=sorted({m['line'] for m in r['members']});matched.add(r['groupCode'])
for r in records:
 if r['groupCode'] in matched:continue
 rows.append(dict(id='tokyo-n02-'+r['groupCode'],name='／'.join(r['names']),prefecture='東京都',area='・'.join(r['areas']),status='候補',group='東京全域・'+r['areas'][0],reason='東京全域の取りこぼし確認用。詳細掲載の要否は調査時に判断。',conditionCount=0,photoCount=0,contentPath=None,inventoryGroupCode=r['groupCode'],operators=sorted({m['operator'] for m in r['members']}),lines=sorted({m['line'] for m in r['members']}),notes='駅の存在と原典路線のみ取得。18条件・家賃・写真は未調査。IDは台帳用で公開slugは着手時に設定。'))
ledger['coverageClaim']=f'国土数値情報2025年度の東京所在駅{len(records)}グループを候補母集団として取込。既存・提案の神奈川駅も別枠で維持。現行営業・掲載要否の確認は別。'
ledger['inventorySource']='research/tokyo-station-inventory.json';ledger['updatedAt']='2026-10-27'
(root/'research/station-ledger.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
print(f'{len(records)} Tokyo station groups / {meta["memberCount"]} source records; {len(rows)} tracked rows')
