// Separate only nearby, parallel screen segments. A lone route stays on its source geometry.
const GAP = 8;
const RADIUS = 10;
const CELL = 24;
const ORDER = ['jr-tokaido', 'jr-saikyo', 'jr-keihin-tohoku', 'jr-yamanote',
  'jr-yokosuka', 'jr-shonan-shinjuku', 'keikyu-main', 'jr-nambu',
  'tokyu-meguro', 'tokyu-toyoko', 'jr-chuo-rapid', 'jr-chuo-sobu'];
const order = id => ORDER.indexOf(id) < 0 ? ORDER.length : ORDER.indexOf(id);
const compare = (a, b) => order(a) - order(b) || a.localeCompare(b);
const intersects = (a, b, box) => !box || !(Math.max(a.x,b.x) < box.left || Math.min(a.x,b.x) > box.right || Math.max(a.y,b.y) < box.top || Math.min(a.y,b.y) > box.bottom);

function normal(a, b, horizontal) {
  let x = -(b.y - a.y), y = b.x - a.x;
  const length = Math.hypot(x, y);
  if (length < 0.01) return null;
  x /= length; y /= length;
  if (horizontal ? (y < 0 || (Math.abs(y) < 1e-8 && x < 0)) : (x < 0 || (Math.abs(x) < 1e-8 && y < 0))) {
    x = -x; y = -y;
  }
  return {x, y};
}

function nearest(point, segment) {
  const {a, b} = segment, dx = b.x-a.x, dy = b.y-a.y;
  const t = Math.max(0, Math.min(1, ((point.x-a.x)*dx+(point.y-a.y)*dy)/(dx*dx+dy*dy)));
  const x = a.x+t*dx, y = a.y+t*dy;
  return {x, y, distance: Math.hypot(x-point.x,y-point.y)};
}

export function layoutRoutes(routes, bounds = null) {
  if (routes.length < 2) return routes;
  const grid = new Map();
  const box = bounds && {left: bounds.left-32, right: bounds.right+32, top: bounds.top-32, bottom: bounds.bottom+32};
  for (const route of routes) for (const line of route.lines) for (let i=1; i<line.length; i++) {
    const a=line[i-1], b=line[i], n=normal(a,b,route.id.startsWith('jr-chuo'));
    if (!n || !intersects(a,b,box)) continue;
    const segment={a,b,n,id:route.id};
    const minX=Math.floor(Math.max(Math.min(a.x,b.x)-RADIUS,box?.left ?? -Infinity)/CELL);
    const maxX=Math.floor(Math.min(Math.max(a.x,b.x)+RADIUS,box?.right ?? Infinity)/CELL);
    const minY=Math.floor(Math.max(Math.min(a.y,b.y)-RADIUS,box?.top ?? -Infinity)/CELL);
    const maxY=Math.floor(Math.min(Math.max(a.y,b.y)+RADIUS,box?.bottom ?? Infinity)/CELL);
    for(let x=minX;x<=maxX;x++) for(let y=minY;y<=maxY;y++) {
      const key=`${x},${y}`;
      if(!grid.has(key)) grid.set(key,[]);
      grid.get(key).push(segment);
    }
  }
  return routes.map(route=>({...route, lines:route.lines.map(line=>{
    // Add points inside the viewport so a long shared segment can separate locally.
    const samples=[];
    for(let i=1;i<line.length;i++) {
      const a=line[i-1],b=line[i];
      const steps=intersects(a,b,box) ? Math.min(256,Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/4))) : 1;
      for(let j=0;j<steps;j++) samples.push({x:a.x+(b.x-a.x)*j/steps,y:a.y+(b.y-a.y)*j/steps});
    }
    if(line.length) samples.push({...line.at(-1)});
    const vectors=samples.map((point,i)=>{
      if(box && !intersects(point,point,box)) return {x:0,y:0};
      const n=normal(samples[Math.max(0,i-1)],samples[Math.min(samples.length-1,i+1)],route.id.startsWith('jr-chuo'));
      if(!n) return {x:0,y:0};
      const nearby=new Map();
      for(const segment of grid.get(`${Math.floor(point.x/CELL)},${Math.floor(point.y/CELL)}`)||[]) {
        if(segment.id===route.id || Math.abs(n.x*segment.n.x+n.y*segment.n.y)<0.97) continue;
        const q=nearest(point,segment);
        if(q.distance>=RADIUS || q.distance >= (nearby.get(segment.id)?.distance ?? Infinity)) continue;
        nearby.set(segment.id,{...q,n:segment.n});
      }
      if(!nearby.size) return {x:0,y:0};
      const ids=[route.id,...nearby.keys()].sort(compare);
      const reference = nearby.get(ids[0])?.n;
      if(reference && n.x*reference.x+n.y*reference.y < 0) {n.x=-n.x;n.y=-n.y;}
      const center=[...nearby.values()].reduce((sum,q)=>sum+(q.x-point.x)*n.x+(q.y-point.y)*n.y,0)/ids.length;
      const desired=center+(ids.indexOf(route.id)-(ids.length-1)/2)*GAP;
      const edge=Math.max(...[...nearby.values()].map(q=>q.distance));
      const fade=Math.min(1,(RADIUS-edge)/4);
      const shift=Math.max(-24,Math.min(24,desired))*fade;
      return {x:n.x*shift,y:n.y*shift};
    });
    // A short taper prevents a step where a second line enters/leaves a corridor.
    return samples.map((point,i)=>{
      let x=0,y=0,weight=0;
      for(let j=Math.max(0,i-3);j<=Math.min(samples.length-1,i+3);j++) {
        const w=Math.max(0,1-Math.hypot(samples[j].x-point.x,samples[j].y-point.y)/12);
        x+=vectors[j].x*w; y+=vectors[j].y*w; weight+=w;
      }
      return {x:point.x+x/weight,y:point.y+y/weight};
    });
  })}));
}
