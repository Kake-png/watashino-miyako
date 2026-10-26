import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=JSON.parse(fs.readFileSync(path.join(root,'public/assets/route-geometry.json'),'utf8'));
// Join touching sections without dropping branches, loops or ends outside the published stations.
export function mergeSections(collection){
 const lines=collection.features.flatMap(f=>f.geometry.type==='MultiLineString'?f.geometry.coordinates:[f.geometry.coordinates]);
 const key=p=>p.join(',');const ends=new Map();
 lines.forEach((line,i)=>[line[0],line.at(-1)].forEach(p=>{const k=key(p);if(!ends.has(k))ends.set(k,[]);ends.get(k).push(i)}));
 const used=new Set(),paths=[];
 const walk=(index,start)=>{let line=lines[index];let result=key(line[0])===start?[...line]:[...line].reverse();used.add(index);
  while(true){const nextKey=key(result.at(-1));const edges=ends.get(nextKey);if(edges.length!==2)break;const next=edges.find(i=>!used.has(i));if(next===undefined)break;line=lines[next];const oriented=key(line[0])===nextKey?line:[...line].reverse();result.push(...oriented.slice(1));used.add(next)}
  paths.push(result);
 };
 for(const [endpoint,indices] of ends)if(indices.length!==2)for(const i of indices)if(!used.has(i))walk(i,endpoint);
 lines.forEach((line,i)=>{if(!used.has(i))walk(i,key(line[0]))});
 return {type:'FeatureCollection',features:paths.map(coordinates=>({type:'Feature',properties:{},geometry:{type:'LineString',coordinates}}))};
}
const output=Object.fromEntries(Object.entries(source).map(([id,c])=>[id,mergeSections(c)]));
fs.writeFileSync(path.join(root,'public/assets/route-display-geometry.json'),JSON.stringify(output));
for(const [id,c] of Object.entries(output))console.log(`${id}: ${c.features.length} complete path(s)`);
