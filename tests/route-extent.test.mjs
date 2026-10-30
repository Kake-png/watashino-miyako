import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ATLAS_DATA as data} from '../public/assets/data.js';
const read=name=>JSON.parse(fs.readFileSync(new URL(`../public/assets/${name}.json`,import.meta.url),'utf8'));
const source=read('route-geometry'),display=read('route-display-geometry');
const points=id=>display[id].features.flatMap(f=>f.geometry.coordinates);
const near=(id,p)=>assert(points(id).some(q=>Math.hypot((q[0]-p[0])*.81,q[1]-p[1])<.004),`${id} must reach ${p}`);
test('routes reach distant termini and shared operating sections beyond published stations',()=>{
 for(const [id,coordinates] of Object.entries({
  'jr-chuo-rapid':[[139.767,35.681],[139.282,35.642]],
  'jr-chuo-sobu':[[139.560,35.703],[140.113,35.613]],
  'jr-keihin-tohoku':[[139.624,35.907],[139.531,35.354],[139.619,35.401]],
  'jr-saikyo':[[139.624,35.907]],
  'jr-tokaido':[[139.078,35.103],[139.767,35.681]],
  'jr-yokosuka':[[139.7,35.233]],
  'jr-shonan-shinjuku':[[139.898,36.559],[139.073,36.383],[139.156,35.256],[139.579,35.297]],
  'tokyu-oimachi':[[139.611,35.6]],
  'tokyu-meguro':[[139.646,35.553]],
  'keikyu-main':[[139.715,35.251]],
  'yokohama-blue':[[139.466,35.397],[139.554,35.568]]
 }))for(const coordinate of coordinates)near(id,coordinate);
});
function segments(c){const result=new Map();for(const f of c.features){const p=f.geometry.coordinates;for(let i=1;i<p.length;i++){const a=p[i-1].join(','),b=p[i].join(',');const k=[a,b].sort().join('|');result.set(k,(result.get(k)||0)+1)}}return [...result].sort(([a],[b])=>a.localeCompare(b))}
test('display processing preserves every source segment including branches and loops',()=>{
 for(const id of Object.keys(source))assert.deepEqual(segments(display[id]),segments(source[id]),id);
 const ring=points('jr-yamanote');assert.deepEqual(ring[0],ring.at(-1));
});
test('each existing station has at least three distinct credited photos',()=>{
 for(const s of data.stations){assert(s.images.length>=3,s.slug);assert.equal(new Set(s.images.map(id=>data.sources[id].sourceUrl)).size,s.images.length,s.slug)}
});
