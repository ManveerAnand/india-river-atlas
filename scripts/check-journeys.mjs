import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathMetric,samplePath,nearestPosition,buildSchedule,stateAt,headingAt} from '../dist/story-engine.mjs';
import {riverStops,overviewStops,destinationOf} from '../dist/story-data.mjs';
const routes=JSON.parse(fs.readFileSync('dist/data/routes.json','utf8'));
const branches=JSON.parse(fs.readFileSync('dist/data/branches.json','utf8'));
const counts={};
for(const r of routes){
 const metric=pathMetric(r.path);assert(metric.total>0);assert.deepEqual(samplePath(metric,0).point,r.path[0]);assert(samplePath(metric,1).point.every((v,i)=>Math.abs(v-r.path.at(-1)[i])<1e-8));
 let defs=riverStops[r.id]||[];const stops=defs.map(s=>({...s,...nearestPosition(r,metric,s.branch?branches[s.branch].join:s.at)})).filter(s=>s.errorKm<28);
 if(!stops.some(s=>s.t===0))stops.unshift({t:0});if(!stops.some(s=>s.t===1))stops.push({t:1});stops.sort((a,b)=>a.t-b.t);
 const schedule=buildSchedule(stops);let prev=-1;
 for(let clock=0;clock<=schedule.duration;clock+=.1){const s=stateAt(schedule,clock);assert(s.t>=prev-1e-10,`${r.name}: route moved backwards`);prev=s.t;assert(samplePath(metric,s.t).point.every(Number.isFinite));assert(Number.isFinite(headingAt(metric,s.t)));}
 for(const c of schedule.chapters){assert.equal(stateAt(schedule,c.arrival+.1).t,c.t);assert.equal(stateAt(schedule,c.end-.1).t,c.t);assert(c.hold>=8,'Reading time too short');}
 assert.equal(stateAt(schedule,schedule.duration).done,true);assert.equal(stateAt(schedule,schedule.duration).t,1);
 counts[destinationOf(r)]=(counts[destinationOf(r)]||0)+1;
}
const ganga=routes.find(r=>r.id==='ganga'),metric=pathMetric(ganga.path);
for(const key of ['alaknanda','yamuna']){const branch=branches[key],n=nearestPosition(ganga,metric,branch.join);assert(n.errorKm<.7);const a=samplePath(metric,n.t).point,b=branch.path.at(-1);assert(Math.hypot(a[0]-b[0],a[2]-b[2])<.007,`${key}: branch disconnected`);}
const overview=buildSchedule(overviewStops,true);assert.equal(overview.chapters.length,7);assert(overview.duration>60);assert.equal(overview.chapters.at(-1).final,true);
const html=fs.readFileSync('dist/index.html','utf8'),app=fs.readFileSync('dist/atlas.mjs','utf8');const ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]));for(const m of app.matchAll(/\$\('([^']+)'\)/g))assert(ids.has(m[1]),`Missing control ${m[1]}`);
console.log(JSON.stringify({routes:routes.length,destinations:counts,overviewScenes:overview.chapters.length,checked:'Monotonic journeys, source/outlet endpoints, held chapters, connected confluences, finite camera headings, and control references'},null,2));
