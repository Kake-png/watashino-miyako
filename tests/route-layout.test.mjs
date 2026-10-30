import test from 'node:test';
import assert from 'node:assert/strict';
import {layoutRoutes} from '../public/assets/route-layout.js';
const pairs=[['jr-keihin-tohoku','jr-yamanote'],['jr-keihin-tohoku','jr-shonan-shinjuku'],['jr-keihin-tohoku','keikyu-main'],['jr-saikyo','jr-shonan-shinjuku'],['jr-shonan-shinjuku','jr-nambu'],['jr-tokaido','keikyu-main'],['tokyu-meguro','tokyu-toyoko'],['jr-chuo-rapid','jr-chuo-sobu']];
const route=(id,line)=>({id,lines:[line]});
const vertical=x=>[{x,y:0},{x,y:100}];
test('parallel shared corridors get 8px separation, independently of source direction and selection order',()=>{
 for(const [a,b] of pairs)for(const scale of [.25,1,4])for(const p of [vertical(0),[{x:0,y:0},{x:100,y:0}]]){
  const line=p.map(p=>({x:p.x*scale,y:p.y*scale}));
  const input=[route(a,line),route(b,[...line].reverse())];
  const result=layoutRoutes(input);
  const center=Math.floor(result[0].lines[0].length/2);
  const first=result[0].lines[0][center],second=[...result[1].lines[0]].reverse()[center];
  assert(Math.abs(Math.hypot(first.x-second.x,first.y-second.y)-8)<.001,`${a}/${b}`);
  assert.deepEqual(layoutRoutes([...input].reverse()).reverse(),result);
 }
});
test('lone and geographically separated routes retain exact original geometry',()=>{
 const a=route('jr-tokaido',vertical(0)), b=route('keikyu-main',vertical(20));
 assert.deepEqual(layoutRoutes([a]),[a]);
 const result=layoutRoutes([a,b]);
 for(let i=0;i<2;i++)for(const p of result[i].lines[0])assert.equal(p.x,i*20);
});
test('local offsets taper back to the source instead of displacing a whole route',()=>{
 const a=route('jr-saikyo',vertical(0));
 const b=route('jr-shonan-shinjuku',[{x:0,y:0},{x:0,y:30},{x:30,y:60},{x:30,y:100}]);
 const [result]=layoutRoutes([a,b]);
 assert(Math.abs(result.lines[0][2].x)>3);
 assert.equal(result.lines[0].at(-1).x,0);
 assert(result.lines[0].every(p=>Math.abs(p.x)<=4.01));
});
test('crossing routes and duplicate vertices do not cause false corridor shifts or invalid coordinates',()=>{
 const a=route('jr-keihin-tohoku',[{x:0,y:0},{x:0,y:0},{x:0,y:100}]);
 const b=route('jr-chuo-rapid',[{x:-50,y:50},{x:50,y:50}]);
 const result=layoutRoutes([a,b],{left:-100,right:100,top:0,bottom:100});
 assert(result.flatMap(r=>r.lines.flat()).every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
 assert(result[0].lines[0].every(p=>p.x===0));
 assert(result[1].lines[0].every(p=>p.y===50));
});
