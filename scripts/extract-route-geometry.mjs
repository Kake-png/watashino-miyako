// Compatibility entry point; complete service extraction also needs station names.
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
if(process.argv.length!==4){console.error('Usage: node scripts/extract-route-geometry.mjs SECTIONS.geojson STATIONS.geojson');process.exit(1)}
const result=spawnSync('python3',[fileURLToPath(new URL('./extract-route-geometry.py',import.meta.url)),...process.argv.slice(2)],{stdio:'inherit'});
if(result.error)throw result.error;process.exit(result.status??1);
