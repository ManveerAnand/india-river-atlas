import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRiverRibbon,revealRiverRibbon} from '../dist/river-rendering.mjs';
import {pathMetric,samplePath,buildSchedule,nearestPosition} from '../dist/story-engine.mjs';
import {riverStops} from '../dist/story-data.mjs';
import {mapNotes,notesFor} from '../dist/guide-data.mjs';
const routes=JSON.parse(fs.readFileSync('dist/data/routes.json'));
for(const route of routes){
 const metric=pathMetric(route.path),mesh=createRiverRibbon(route.path,0xffd18b,5,1,true),original=mesh.geometry.attributes.position.array.slice();
 assert.equal(mesh.material.depthTest,false);assert.equal(mesh.material.uniforms.width.value,5);
 for(const t of [0,.17,.82,.33,1,0,1]){
  const sample=samplePath(metric,t);revealRiverRibbon(mesh,sample);
  assert.equal(mesh.geometry.drawRange.count,sample.index*6);
  assert(mesh.geometry.drawRange.count<=mesh.geometry.index.count);
  for(let i=0;i<original.length;i++)if(i<sample.index*6||i>=sample.index*6+6)assert.equal(mesh.geometry.attributes.position.array[i],original[i],`${route.id}: seek left a distorted segment`);
  for(let side=0;side<2;side++)for(let k=0;k<3;k++)assert(Math.abs(mesh.geometry.attributes.position.array[sample.index*6+side*3+k]-sample.point[k]-(k===1?.07:0))<1e-5);
 }
 mesh.geometry.dispose();mesh.material.dispose();
}
const ganga=routes.find(r=>r.id==='ganga'),metric=pathMetric(ganga.path);
const schedule=buildSchedule(riverStops.ganga.map(s=>({...s,...nearestPosition(ganga,metric,s.at)})));
assert(schedule.duration<120,`Map journey too long: ${schedule.duration}s`);
assert(schedule.chapters.every(c=>c.hold<=10&&c.travel<=8));
for(const scene of Object.keys(mapNotes))assert.equal(notesFor({chapter:{scene},travelling:false},'ganga',false).length,2);
console.log(`Route rendering seeks checked for ${routes.length} rivers; Ganga map tour ${Math.round(schedule.duration)}s; eight optional-scene map guides.`);
