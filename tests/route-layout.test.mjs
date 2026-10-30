import test from 'node:test';import assert from 'node:assert/strict';
import {ROUTE_LANES as lanes,offsetRoutePoints as offset} from '../public/assets/route-layout.js';
const pairs=[['jr-keihin-tohoku','jr-yamanote'],['jr-keihin-tohoku','jr-shonan-shinjuku'],['jr-keihin-tohoku','keikyu-main'],['jr-saikyo','jr-shonan-shinjuku'],['jr-shonan-shinjuku','jr-nambu'],['jr-tokaido','keikyu-main'],['tokyu-meguro','tokyu-toyoko']];
test('reported route pairs keep visible lanes for either source direction at every tested scale',()=>{
 for(const scale of [.25,1,4,16])for(const [a,b] of pairs)for(const line of [[{x:0,y:0},{x:0,y:100},{x:10,y:200}],[{x:0,y:0},{x:100,y:0},{x:200,y:10}]]){
 const p=line.map(p=>({x:p.x*scale,y:p.y*scale}));
 const first=offset(p,lanes[a]),second=offset([...p].reverse(),lanes[b]).reverse();
 for(let i=0;i<p.length;i++)assert(Math.hypot(first[i].x-second[i].x,first[i].y-second[i].y)>=11.9,`${a}/${b}`);
 }
});
test('route offsets are reversal invariant, finite and tolerate duplicate points',()=>{
 const p=[{x:0,y:0},{x:0,y:0},{x:10,y:20},{x:20,y:40}];
 assert.deepEqual(offset(p,12),offset([...p].reverse(),12).reverse());
 assert(offset(p,12).every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
});
