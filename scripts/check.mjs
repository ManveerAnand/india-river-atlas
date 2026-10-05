import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root=fileURLToPath(new URL('../',import.meta.url));
process.chdir(root);
function run(args){
 const result=spawnSync(process.execPath,args,{encoding:'utf8'});
 if(result.error)throw result.error;
 if(result.status!==0){process.stderr.write(result.stdout||'');process.stderr.write(result.stderr||'');process.exit(result.status||1);}
}
for(const name of fs.readdirSync('dist').filter(n=>n.endsWith('.mjs'))){
 const file=path.join('dist',name);run(['--check',file]);
 for(const match of fs.readFileSync(file,'utf8').matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)){
  const specifier=match[1];
  if(specifier.startsWith('.')&&!fs.existsSync(path.resolve(path.dirname(file),specifier.split('?')[0])))throw new Error(`Missing import: ${file} -> ${specifier}`);
 }
}
run(['scripts/check-journeys.mjs']);
run(['scripts/check-guide.mjs']);
run(['--no-warnings','--experimental-loader','./scripts/three-loader.mjs','scripts/check-local-scenes.mjs']);
run(['--no-warnings','--experimental-loader','./scripts/three-loader.mjs','scripts/check-river-rendering.mjs']);
console.log('Passed: module syntax and imports, 19 river routes, 16 scene configurations, 62 guide notes, screen-width strokes and backward seeking.');
