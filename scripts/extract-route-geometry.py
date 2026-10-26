"""Extract complete displayed services from MLIT N02 section/station GeoJSON.
Usage: python3 scripts/extract-route-geometry.py SECTIONS.geojson STATIONS.geojson
See docs/route-geometry.md for the source and shapefile conversion.
"""
import pathlib,sys
ROOT=pathlib.Path(__file__).resolve().parent.parent
import json,math,heapq

def dist(a,b):return math.hypot((a[0]-b[0])*.81,a[1]-b[1])
def station(name,line=None,op='東日本旅客鉄道'):
 if op=='東日本旅客鉄道' and line is None:line={'武蔵小杉':'東海道線','大崎':'山手線','東京':'東海道線','高崎':'高崎線'}.get(name)
 ss=[f for f in S if f['properties']['N02_005']==name and f['properties']['N02_004']==op and (line is None or f['properties']['N02_003']==line)]
 if not ss:raise Exception((name,line))
 pts=ss[0]['geometry']['coordinates'];return [(pts[0][0]+pts[-1][0])/2,(pts[0][1]+pts[-1][1])/2]
def graph(lines,op='東日本旅客鉄道'):
 g={}
 for f in F:
  p=f['properties']
  if p['N02_003'] not in lines or p['N02_004']!=op:continue
  c=f['geometry']['coordinates']
  for a,b in zip(c,c[1:]):
   a,b=tuple(a),tuple(b);w=dist(a,b);g.setdefault(a,{})[b]=w;g.setdefault(b,{})[a]=w
 # Keep the connected passenger network; detached station throat fragments are not routes.
 seen=set();components=[]
 for start in g:
  if start in seen:continue
  component=set();pending=[start]
  while pending:
   n=pending.pop()
   if n in component:continue
   component.add(n);seen.add(n);pending.extend(t for t in g[n] if t not in component)
  components.append(component)
 largest=max(components,key=len)
 return {n:g[n] for n in largest}
def shortest(g,a,b,exact=False,finish_exact=False):
 starts=[tuple(a)] if exact else sorted(g,key=lambda x:dist(x,a))[:30]; ends=[tuple(b)] if finish_exact else sorted(g,key=lambda x:dist(x,b))[:30]
 starts=[x for x in starts if dist(x,a)<.0028];ends={x:dist(x,b)*5 for x in ends if dist(x,b)<.0028}
 q=[(dist(x,a)*5,x) for x in starts];heapq.heapify(q);cost={n:d for d,n in q};prev={};best=None
 while q:
  d,n=heapq.heappop(q)
  if d!=cost[n]:continue
  if best and d>best[0]:break
  if n in ends and (best is None or d+ends[n]<best[0]):best=(d+ends[n],n)
  for t,w in g[n].items():
   nd=d+w
   if nd<cost.get(t,1e20):cost[t]=nd;prev[t]=n;heapq.heappush(q,(nd,t))
 if not best:return None
 n=best[1];path=[n]
 while n in prev:n=prev[n];path.append(n)
 return path[::-1]


if __name__ == '__main__':
 if len(sys.argv)!=3:raise SystemExit(__doc__)
 F=json.load(open(sys.argv[1],encoding='utf-8'))['features']
 S=json.load(open(sys.argv[2],encoding='utf-8'))['features']
 specs=json.load(open(ROOT/'scripts/route-scope.json',encoding='utf-8'));out={}
 def chain_path(lines,op,chain):
  g=graph(lines,op)
  def candidates(name):
   point=station(name,op=op)
   return [n for n in sorted(g,key=lambda x:dist(x,point))[:30] if dist(n,point)<.0028]
  costs={n:dist(n,station(chain[0],op=op))*5 for n in candidates(chain[0])};history=[]
  for name in chain[1:]:
   target=station(name,op=op);q=[(d,n) for n,d in costs.items()];heapq.heapify(q);parents={}
   while q:
    d,n=heapq.heappop(q)
    if d!=costs[n]:continue
    for other,w in g[n].items():
     value=d+w
     if value<costs.get(other,1e20):costs[other]=value;parents[other]=n;heapq.heappush(q,(value,other))
   costs={n:costs[n]+dist(n,target)*5 for n in candidates(name) if n in costs}
   if not costs:raise ValueError(f'No connected path to {name}')
   history.append(parents)
  node=min(costs,key=costs.get);parts=[]
  for parents in reversed(history):
   part=[node]
   while node in parents:node=parents[node];part.append(node)
   parts.append(part[::-1])
  pts=[]
  for part in reversed(parts):pts.extend(part if not pts else part[1:])
  if chain[0]==chain[-1] and pts[-1]!=pts[0]:
   closure=shortest(g,pts[-1],pts[0],exact=True,finish_exact=True)
   if not closure:raise ValueError('Cannot close loop')
   pts.extend(closure[1:])
  return pts

 for route,spec in specs.items():
  lines=spec['lines'];op=spec['operator']
  paths=[chain_path(lines,op,c) for c in spec['chains']] if spec['chains'] else [f['geometry']['coordinates'] for f in F if f['properties']['N02_003'] in lines and f['properties']['N02_004']==op]
  paths.extend(chain_path(e['lines'],op,e['chain']) for e in spec.get('extensions',[]))
  if not paths:raise ValueError(f'Empty route: {route}')
  out[route]=dict(type='FeatureCollection',features=[dict(type='Feature',properties={},geometry=dict(type='LineString',coordinates=p)) for p in paths])
 json.dump(out,open(ROOT/'public/assets/route-geometry.json','w'),separators=(',',':'))
 print(f'Wrote {len(out)} complete route geometries')
