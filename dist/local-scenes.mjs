import * as T from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {sceneDefinitions,sceneOrder,sceneBeat,cameraAt} from './scene-data.mjs?v=3.3';
import {buildMiniature} from './local-models.mjs?v=3.5';
const $=id=>document.getElementById(id),lerp=(a,b,t)=>a+(b-a)*t;

export class LocalScenes{
 constructor(view,callbacks){this.view=view;this.callbacks=callbacks;this.cache=new Map();this.active=null;this.selected=null;this.viewpoint='guided';this.clock=0;this.failed=new Set();this.free=false;this.phase=0;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.frames=[];this.frameStamp=0;
  this.camera=new T.PerspectiveCamera(42,1,.1,250);this.controls=new OrbitControls(this.camera,view.renderer.domElement);Object.assign(this.controls,{enabled:false,enableDamping:true,dampingFactor:.07,minDistance:4,maxDistance:100,maxPolarAngle:Math.PI*.48,minPolarAngle:.1});this.controls.addEventListener('start',()=>{if(this.active){this.viewpoint='free';this.selected=null;this.callbacks.explore();this.updateSelection();}});
  view.renderer.shadowMap.enabled=true;view.renderer.shadowMap.type=T.PCFSoftShadowMap;view.presentation=this;
  $('local-above').onclick=()=>this.interact('viewpoint','above');$('local-continue').onclick=()=>this.callbacks.resume();$('local-map').onclick=()=>this.interact('viewpoint','atlas');$('local-retry').onclick=()=>{if(this.retryId){this.failed.delete(this.retryId);this.get(this.retryId);}};
  this.labelNodes=[];this.route=null;
 }
 setRoute(route,chapters){this.route=route;this.chapters=chapters;const svg=$('route-locator');svg.replaceChildren();if(!route)return;const ns='http://www.w3.org/2000/svg',coords=route.coordinates,minX=Math.min(...coords.map(p=>p[0])),maxX=Math.max(...coords.map(p=>p[0])),minY=Math.min(...coords.map(p=>p[1])),maxY=Math.max(...coords.map(p=>p[1]));this.mapPoint=p=>[14+(p[0]-minX)/(maxX-minX)*172,16+(maxY-p[1])/(maxY-minY)*64];const path=document.createElementNS(ns,'polyline');path.setAttribute('points',coords.filter((_,i)=>i%5===0).map(p=>this.mapPoint(p).join(',')).join(' '));path.setAttribute('fill','none');path.setAttribute('stroke','#8abebc');path.setAttribute('stroke-width','1.5');svg.append(path);this.locatorDot=document.createElementNS(ns,'circle');this.locatorDot.setAttribute('r','4');this.locatorDot.setAttribute('fill','#ffd297');svg.append(this.locatorDot);for(const [p,txt] of [[coords[0],'Source'],[coords.at(-1),'Estuary']]){const [x,y]=this.mapPoint(p),text=document.createElementNS(ns,'text');text.setAttribute('x',x);text.setAttribute('y',y+(txt==='Source'?-6:14));text.setAttribute('text-anchor',txt==='Source'?'start':'end');text.textContent=txt;svg.append(text);}}
 get(id){if(this.cache.has(id))return this.cache.get(id);if(this.failed.has(id))return null;try{const model=buildMiniature(sceneDefinitions[id],this.view.container.clientWidth<700);this.cache.set(id,model);return model;}catch(error){console.error('Local scene unavailable:',id,error);this.failed.add(id);this.retryId=id;return null;}}
 reset(){this.deactivate();this.selected=null;this.viewpoint='guided';this.clock=0;this.lastElapsed=null;this.forcedAtlas=false;this.sceneKey=null;this.failed.clear();$('local-error').hidden=true;for(const m of this.cache.values())m.dispose();this.cache.clear();}
 deactivate(){if(!this.active)return;this.active=null;this.controls.enabled=false;this.view.controls.enabled=true;$('local-overlay').hidden=true;$('local-labels').hidden=true;document.body.classList.remove('local-scene');this.view.renderer.setClearColor(0x08141f,0);this.fade();}
 fade(){const node=$('scene-transition');node.classList.remove('crossing');void node.offsetWidth;node.classList.add('crossing');}
 sync(state,s,dt){this.state=state;this.sample=s;const id=state.mode==='river'&&state.river?.id==='ganga'?s?.chapter.scene:null;const key=id?`${id}-${s.chapter.index}`:null;
  if(key!==this.sceneKey){this.sceneKey=key;this.forcedAtlas=false;this.selected=null;this.viewpoint='guided';this.lastElapsed=null;}
  const eligible=id&&state.localVisit&&!s.travelling&&!this.view.flight&&!this.forcedAtlas;
  if(!eligible){this.deactivate();return;}
  const model=this.get(id);$('local-error').hidden=!!model;if(!model){this.deactivate();return;}
  const changed=this.active!==model;if(changed){this.active=model;this.selected=null;this.viewpoint='guided';this.controls.enabled=true;this.view.controls.enabled=false;document.body.classList.add('local-scene');$('local-overlay').hidden=false;$('local-labels').hidden=false;this.populate(model.definition);this.fade();this.clock=s.seconds-s.chapter.arrival;this.snapCamera(cameraAt(model.definition,.44,this.reduced));this.prune(id);}
  this.phase=.44;this.free=state.free;const elapsed=s.seconds-s.chapter.arrival;
  if(this.lastElapsed!==null&&Math.abs(elapsed-this.lastElapsed)>.5)this.clock=elapsed;
  else if((state.free||state.reading)&&!state.activityPaused&&!this.reduced&&!document.hidden)this.clock+=dt*(state.reading?1:state.speed);
  else if(!state.free)this.clock+=this.lastElapsed===null?0:Math.max(0,elapsed-this.lastElapsed);
  this.lastElapsed=elapsed;const autoConnections=!state.free&&s.phase>.35&&s.phase<.75&&['confluence','sangam'].includes(model.definition.kind);this.active.update(this.reduced?0:this.clock,this.selected||(autoConnections?'connections':null));
  $('local-beat').textContent=state.free?'Exploring':sceneBeat(s.phase);$('local-continue').hidden=!state.free;$('local-tip').textContent=state.free?'Drag to look around · Continue when you’re ready':'Select a place to explore · Drag to look around';
  if(this.route&&this.locatorDot){const def=model.definition,[x,y]=this.mapPoint(def.anchor);this.locatorDot.setAttribute('cx',x);this.locatorDot.setAttribute('cy',y);$('locator-current').textContent=def.city;}
  if(!state.free)this.selected=null;
 }
 prune(id){const next=sceneOrder[sceneOrder.indexOf(id)+1];for(const [key,m] of this.cache)if(key!==id&&key!==next){m.dispose();this.cache.delete(key);}if(next&&!this.failed.has(next)){// Procedural assets are local and deterministic; prepare the next stop during this hold.
   this.get(next);
  }}
 populate(def){$('local-city').textContent=def.city;$('local-region').textContent=def.region;$('local-place').textContent=def.place;$('local-description').textContent=def.text;$('local-detail-title').textContent=def.caption;$('local-source').href=def.source;
  $('local-actions').replaceChildren();$('local-labels').replaceChildren();this.labelNodes=[];
  def.points.forEach((p,index)=>{const action=document.createElement('button');action.textContent=p.label;action.dataset.poi=p.id;action.onclick=()=>this.interact('poi',p.id);$('local-actions').append(action);const label=document.createElement('button');label.className='place-label';label.textContent=p.label;label.setAttribute('aria-label','Explore '+p.label);label.onclick=()=>this.interact('poi',p.id);$('local-labels').append(label);this.labelNodes.push({node:label,index});});this.updateSelection();
 }
 updateSelection(){for(const b of $('local-actions').children)b.setAttribute('aria-pressed',String(b.dataset.poi===this.selected));$('local-above').setAttribute('aria-pressed',String(this.viewpoint==='above'));}
 interact(action,value){if(action==='return'&&this.state?.free){this.callbacks.resume();return;}if(!this.active)throw new Error('Open a local Ganga scene first.');const def=this.active.definition;
  if(action==='return'){this.callbacks.resume();return;}
  const point=action==='poi'?def.points.find(p=>p.id===value):null;if(action==='poi'&&!point)throw new Error('Choose a point of interest in this scene.');if(action==='viewpoint'&&!['above','atlas'].includes(value))throw new Error('Choose above or atlas.');
  this.callbacks.explore();this.selected=point?.id||null;this.viewpoint=point?.view||value;
  $('local-detail-title').textContent=point?.label||'A view of the whole scene';$('local-description').textContent=point?.text||'Look down on the water, banks and surrounding activity. Drag to explore from another angle.';this.updateSelection();
  if(this.viewpoint==='atlas'){this.forcedAtlas=true;this.deactivate();this.callbacks.atlas();return;}
  this.detourStart=this.clock;this.active.focus(this.selected);this.easeTo=null;
 }
 resume(){this.forcedAtlas=false;this.selected=null;this.viewpoint='guided';if(this.active){const d=this.active.definition;$('local-detail-title').textContent=d.caption;$('local-description').textContent=d.text;this.updateSelection();}}
 snapCamera(shot){this.camera.position.set(...shot.position);this.controls.target.set(...shot.target);this.camera.lookAt(this.controls.target);}
 detourPose(){const def=this.active.definition,p=def.points.find(x=>x.id===this.selected),anchor=p?this.active.anchor(def.points.indexOf(p)).toArray():[0,2,0],v=this.viewpoint;
  if(v==='guided')return cameraAt(def,.44,this.reduced);
  if(v==='above')return{position:[20,57,34],target:[-5,1,0]};
  if(v==='boat'||v==='vehicle'){if(this.clock-this.detourStart>16)return cameraAt(def,.45,this.reduced);const a=anchor;return{position:[a[0]+(v==='boat'?7:9),a[1]+(v==='boat'?4:5),a[2]+10],target:a};}
  if(v==='left')return{position:[-32,25,18],target:[-12,1,-13]};if(v==='right')return{position:[32,25,20],target:[12,1,-8]};
  if(v==='under')return{position:[7,3,16],target:[7,3,-8]};if(v==='cutaway')return{position:[22,23,25],target:[0,2,0]};if(v==='terrace')return{position:[-18,7,15],target:[1,1,0]};if(v==='edge')return{position:[2,3,12],target:[-9,1,4]};
  if(v==='follow'){const f=Math.min(1,(this.clock-this.detourStart)/12);return{position:[5,4,lerp(-9,18,f)],target:[0,1,lerp(-18,7,f)]};}
  return{position:[anchor[0]+18,anchor[1]+10,anchor[2]+20],target:anchor};
 }
 render(dt){if(!this.active)return false;const w=this.view.container.clientWidth,h=this.view.container.clientHeight;this.camera.aspect=w/h;this.camera.setViewOffset(w,h,w<700?0:-Math.min(125,w*.09),w<700?-35:0,w,h);this.camera.updateProjectionMatrix();
  if(!this.free||this.viewpoint!=='free'){const pose=this.free?this.detourPose():cameraAt(this.active.definition,this.phase,this.reduced),t=this.reduced?1:1-Math.exp(-dt*2);this.camera.position.lerp(new T.Vector3(...pose.position),t);this.controls.target.lerp(new T.Vector3(...pose.target),t);}
  this.camera.position.y=Math.max(1.6,this.camera.position.y);this.controls.update();this.projectLabels(w,h);this.view.renderer.render(this.active.scene,this.camera);
  const now=performance.now();if(this.frameStamp){this.frames.push(now-this.frameStamp);if(this.frames.length>120)this.frames.shift();}this.frameStamp=now;return true;
 }
 projectLabels(w,h){const bounds=this.view.container.getBoundingClientRect(),occupied=[];for(const id of ['local-heading','local-panel','local-locator','transport']){const r=$(id).getBoundingClientRect();occupied.push({x:r.left-bounds.left,y:r.top-bounds.top,w:r.width,h:r.height});}
  this.labelNodes.forEach(({node,index})=>{const p=this.active.anchor(index).project(this.camera),x=(p.x+1)*w/2,y=(1-p.y)*h/2;const rect={x:x-node.offsetWidth/2,y:y-38,w:node.offsetWidth,h:38};let show=p.z>-1&&p.z<1&&x>50&&x<w-50&&y>80&&y<h-55;if(occupied.some(r=>rect.x<r.x+r.w+10&&rect.x+rect.w>r.x-10&&rect.y<r.y+r.h+8&&rect.y+rect.h>r.y-8))show=false;node.style.visibility=show?'visible':'hidden';node.style.left=x+'px';node.style.top=y+'px';if(show)occupied.push(rect);});
 }
 snapshot(){return{activeScene:this.active?sceneOrder.find(k=>sceneDefinitions[k]===this.active.definition):null,beat:this.active?sceneBeat(this.phase):null,selectedPoint:this.selected,viewpoint:this.viewpoint,exploring:!!this.state?.free,activityPaused:!!this.state?.activityPaused,cachedScenes:[...this.cache.keys()],...this.active?.stats(),fps:this.frames.length?Math.round(1000/(this.frames.reduce((a,b)=>a+b,0)/this.frames.length)):null,camera:this.active?{position:this.camera.position.toArray(),target:this.controls.target.toArray()}:null,points:this.active?.definition.points.map(p=>({id:p.id,label:p.label,view:p.view}))||[]};}
}
