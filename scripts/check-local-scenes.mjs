import assert from 'node:assert/strict';
import {sceneDefinitions,sceneOrder,cameraAt} from '../dist/scene-data.mjs';
import {buildMiniature} from '../dist/local-models.mjs';
import {riverStops} from '../dist/story-data.mjs';
import {pathMetric,nearestPosition} from '../dist/story-engine.mjs';
import fs from 'node:fs';
import {Vector3} from 'three';
const ganga=JSON.parse(fs.readFileSync('dist/data/routes.json')).find(r=>r.id==='ganga'),metric=pathMetric(ganga.path);
assert.equal(riverStops.ganga.length,8);
const positions=riverStops.ganga.map(s=>nearestPosition(ganga,metric,s.at).t);
for(let i=1;i<positions.length;i++)assert(positions[i]>positions[i-1],`Chapter ${i} must be downstream`);
const report=[];
for(const compact of [false,true])for(const id of sceneOrder){
 const def=sceneDefinitions[id],model=buildMiniature(def,compact);assert(def.points.length>=2);assert(def.hold>=30);assert(model.people.length<=24);assert(model.boats.length<=6);
 for(let phase=0;phase<=1;phase+=.01){const s=cameraAt(def,phase);assert(s.position.every(Number.isFinite));assert(s.target.every(Number.isFinite));assert(s.position[1]>1);}
 for(const time of [0,5,19,42,100]){model.update(time);model.root.traverse(o=>{assert(o.matrixWorld.elements.every(Number.isFinite));if(o.isMesh){assert(o.geometry.attributes.position.count>0);for(const v of o.geometry.attributes.position.array)assert(Number.isFinite(v));}});}
 model.update(12);const before=model.root.toJSON();model.update(5);model.update(12);assert.deepEqual(model.root.toJSON(),before,'Seeking must reconstruct identical actor transforms');
 if(id==='farakka'){model.update(8,'cutaway');assert(model.stats().cutaway);model.update(8);assert(!model.stats().cutaway);model.update(8,'feeder');assert.deepEqual(model.stats().highlightedConnections,['feeder']);}
 if(id==='devprayag'){model.update(8,'alaknanda');assert.deepEqual(model.stats().highlightedConnections,['alaknanda']);}
 if(id==='varanasi'||id==='haridwar'){
  const walkers=model.people.filter(p=>p.userData.action==='stairs');assert.equal(walkers.length,2);
  // Check the actual animated mesh vertices against the actual bank/step solids
  // through a complete down, bathing and return cycle, at both detail levels.
  const v=new Vector3();
  for(let t=0;t<46;t+=.08){model.update(t);for(const person of walkers)person.traverse(o=>{if(!o.isMesh)return;const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);for(const s of model.walkSurfaces)if(v.x>=s.minX&&v.x<=s.maxX&&v.z>=s.minZ&&v.z<=s.maxZ)assert(v.y>=s.top-.001,`${id} walker intersects a step at ${t.toFixed(2)}s`);}});}
 }
 if(id==='malviya'){assert(model.vehicles.length>=10);assert(model.boats.length);for(let t=0;t<200;t+=.5){model.update(t);for(const v of model.vehicles){const pos=v.getWorldPosition(v.position.clone());assert(pos.y>=5.5,'Vehicle must remain on a deck');}}}
 def.points.forEach((_,i)=>assert(model.anchor(i).toArray().every(Number.isFinite)));
 report.push({id,compact,...model.stats()});model.dispose();assert.equal(model.scene.children.length,0);
}
console.log(JSON.stringify({checked:'Eight ordered chapters; all models at two detail levels; deterministic seeking; finite geometry and cameras; deck placement; cutaway restoration; resource disposal',scenes:report},null,2));
