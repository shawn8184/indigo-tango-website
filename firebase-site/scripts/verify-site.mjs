import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const manifest=JSON.parse(await readFile(resolve(root,'download-manifest.json'),'utf8'));
let checked=0;
for(const [path,spec] of Object.entries(manifest.files)){
 const bytes=await readFile(resolve(root,'public','.'+path));
 const digest=createHash('sha256').update(bytes).digest('hex');
 if(digest!==spec.sha256)throw Error('Snapshot differs: '+path);
 checked++;
}
const config=JSON.parse(await readFile(resolve(root,'firebase.json'),'utf8'));
if(config.hosting.site!=='indigo-tango-website'||config.hosting.public!=='public')throw Error('Unexpected hosting target');
console.log(`Verified ${checked} recovered public files and Firebase target.`);
