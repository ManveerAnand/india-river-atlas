import * as T from 'three';

// All meshes are original procedural 3D miniatures. Coordinates are local units.
export function buildMiniature(def,compact=false){
 const scene=new T.Scene();scene.background=new T.Color('#163b46');scene.fog=new T.Fog('#163b46',75,165);
 scene.add(new T.HemisphereLight('#d4eff7','#554735',2.3));
 const sun=new T.DirectionalLight('#ffe0af',3.1);sun.position.set(25,55,22);sun.castShadow=true;sun.shadow.mapSize.set(compact?1024:2048,compact?1024:2048);Object.assign(sun.shadow.camera,{left:-55,right:55,top:55,bottom:-55,near:.5,far:140});sun.shadow.bias=-.0004;sun.shadow.normalBias=.07;scene.add(sun);
 const root=new T.Group(),actors=new T.Group();actors.userData.dynamic=true;root.add(actors);
 const geometries=new Set(),materials=new Set(),cache=new Map(),gcache=new Map(),animations=[],boats=[],vehicles=[],people=[],pickTargets=[],walkSurfaces=[];
 const material=(color)=>{if(!cache.has(color)){const m=new T.MeshStandardMaterial({color,roughness:.79,metalness:0});cache.set(color,m);materials.add(m);}return cache.get(color);};
 const geometry=(name,fn)=>{if(!gcache.has(name)){const g=fn();gcache.set(name,g);geometries.add(g);}return gcache.get(name);};
 const boxGeo=geometry('box',()=>new T.BoxGeometry(1,1,1)),sphereGeo=geometry('sphere',()=>new T.SphereGeometry(1,12,8)),cylGeo=geometry('cylinder',()=>new T.CylinderGeometry(1,1,1,10)),coneGeo=geometry('cone',()=>new T.ConeGeometry(1,1,7));
 function mesh(geo,color,pos,scale,parent=root){const m=new T.Mesh(geo,material(color));m.position.set(...pos);m.scale.set(...scale);parent.add(m);return m;}
 const box=(x,y,z,w,h,d,c,p=root)=>mesh(boxGeo,c,[x,y,z],[w,h,d],p);
 // Use the same solids for pedestrian support and the visible ghat geometry.
 function groundBox(...args){const m=box(...args);walkSurfaces.push({minX:m.position.x-m.scale.x/2,maxX:m.position.x+m.scale.x/2,minZ:m.position.z-m.scale.z/2,maxZ:m.position.z+m.scale.z/2,top:m.position.y+m.scale.y/2});return m;}
 function stairSupport(x,z){let y=-.15;for(const s of walkSurfaces){if(z<s.minZ-.22||z>s.maxZ+.22)continue;const distance=Math.max(s.minX-x,x-s.maxX,0);if(distance>.49)continue;const t=Math.max(0,Math.min(1,(.49-distance)/.16)),blend=t*t*(3-2*t);y=Math.max(y,-.15+(s.top+.15)*blend);}return y+.04;}
 const cylinder=(x,y,z,r,h,c,p=root)=>mesh(cylGeo,c,[x,y,z],[r,h,r],p);
 const ball=(x,y,z,s,c,p=root)=>mesh(sphereGeo,c,[x,y,z],Array.isArray(s)?s:[s,s,s],p);
 function beam(a,b,r,c,p=root){const mid=new T.Vector3(...a).add(new T.Vector3(...b)).multiplyScalar(.5),delta=new T.Vector3(...b).sub(new T.Vector3(...a));const m=mesh(cylGeo,c,mid.toArray(),[r,delta.length(),r],p);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return m;}
 function island(points,height,color){const shape=new T.Shape();points.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();const g=new T.ExtrudeGeometry(shape,{depth:height,bevelEnabled:false});g.rotateX(-Math.PI/2);geometries.add(g);const m=new T.Mesh(g,material(color));m.position.y=-.65;root.add(m);return m;}
 function rock(x,y,z,s,color='#9a9d94'){return mesh(geometry('rock',()=>new T.IcosahedronGeometry(1,0)),color,[x,y,z],[s,s*.6,s*.8]);}
 function tree(x,y,z,s=1){cylinder(x,y+1.4*s,z,.17*s,2.8*s,'#725745');ball(x,y+3.8*s,z,[1.5*s,2*s,1.35*s],'#466f58');ball(x+.8*s,y+3.5*s,z+.2*s,[1.2*s,1.6*s,1.2*s],'#567d5b');}
 const archGeo=geometry('arch',()=>{const s=new T.Shape();s.moveTo(-.5,0);s.lineTo(.5,0);s.lineTo(.5,.7);s.absarc(0,.7,.5,0,Math.PI,false);s.lineTo(-.5,0);return new T.ExtrudeGeometry(s,{depth:.05,bevelEnabled:false,curveSegments:6});});
 function building(x,y,z,w,h,d,color,p=root){box(x,y+h/2,z,w,h,d,color,p);box(x,y+h+.15,z,w+.25,.3,d+.3,'#e4c69b',p);box(x,y+.3,z,w+.2,.35,d+.2,'#b58b68',p);
  for(let floor=0;floor<Math.floor(h/1.9);floor++)for(let col=0;col<Math.max(1,Math.floor(d/1.8));col++){const win=mesh(archGeo,'#3f514f',[x+w/2+.015,y+.6+floor*1.9,z-d/2+.85+col*1.8],[.7,.85,1],p);win.rotation.y=Math.PI/2;}
  for(const dz of [-d/2,d/2])box(x,y+h+.6,z+dz,w,.8,.18,color,p);
 }
 function pavilion(x,y,z,s=1,color='#d8ba89'){for(const dx of [-1,1])for(const dz of [-1,1]){cylinder(x+dx*s,y+1.1*s,z+dz*s,.13*s,2.2*s,color);box(x+dx*s,y+2.2*s,z+dz*s,.4*s,.22*s,.4*s,'#edd7b0');}box(x,y+2.45*s,z,2.8*s,.35*s,2.8*s,color);const dome=mesh(geometry('dome',()=>new T.SphereGeometry(1,16,8,0,Math.PI*2,0,Math.PI/2)),'#cf9864',[x,y+2.62*s,z],[1.65*s,1.35*s,1.65*s]);cylinder(x,y+4.2*s,z,.09*s,.8*s,'#f5d18b');ball(x,y+4.5*s,z,.15*s,'#f5d18b');return dome;}
 function temple(x,y,z,s=1){building(x,y,z,3*s,3*s,3*s,'#d69c6b');for(let i=0;i<6;i++){const a=1-i*.12;box(x,y+3*s+i*.6*s,z,3*s*a,.65*s,3*s*a,'#e0ae79');}mesh(coneGeo,'#e9c184',[x,y+7*s,z],[.55*s,1.4*s,.55*s]);}
 function human(x,y,z,index,action='standing',parent=actors){const person=new T.Group();person.position.set(x,y,z);parent.add(person);const clothes=['#f1c05f','#d77954','#e8e0cd','#619b9c','#9f6a87','#7d92b6'],skin=['#a97250','#bf8c61','#895c46'];
  const color=clothes[index%6];cylinder(0,.65,0,.19,.56,color,person);mesh(coneGeo,color,[0,.46,0],[.26,.45,.24],person);ball(0,1.15,0,.17,skin[index%3],person);ball(0,1.26,-.035,[.17,.10,.17],'#3b3433',person);
  const limbs=[];for(const side of [-1,1]){const leg=new T.Group();leg.position.set(side*.105,.47,0);person.add(leg);box(0,-.22,0,.13,.45,.14,'#e3d7bd',leg);box(0,-.45,.04,.14,.07,.24,'#624c3b',leg);limbs.push(leg);const arm=new T.Group();arm.position.set(side*.22,.89,0);person.add(arm);box(0,-.19,0,.105,.4,.12,color,arm);ball(0,-.4,0,.065,skin[index%3],arm);limbs.push(arm);}
  const base=person.position.clone();person.rotation.y=(index*.9)%6.28;person.userData.action=action;people.push(person);
  animations.push(time=>{const f=time*2+index*1.71;if(action==='walking'){person.position.z=base.z+Math.sin(time*.16+index)*2;person.rotation.y=Math.cos(time*.16+index)>0?0:Math.PI;limbs[0].rotation.x=Math.sin(f)*.4;limbs[2].rotation.x=-Math.sin(f)*.4;limbs[1].rotation.x=-Math.sin(f)*.25;limbs[3].rotation.x=Math.sin(f)*.25;}
   if(action==='stairs'){const cycle=(time*.022+index*.11)%1,down=cycle<.4,rest=cycle>=.4&&cycle<.6,progress=down?cycle/.4:rest?1:(1-cycle)/.4;person.position.x=-16.6+9.5*progress;person.position.y=stairSupport(person.position.x,base.z);person.rotation.y=down||rest?Math.PI/2:-Math.PI/2;limbs[0].rotation.x=rest?0:Math.sin(f)*.32;limbs[2].rotation.x=-limbs[0].rotation.x;limbs[1].rotation.x=rest?-.7-Math.sin(f*.6)*.5:-Math.sin(f)*.2;limbs[3].rotation.x=rest?limbs[1].rotation.x:Math.sin(f)*.2;}
   if(action==='bathing'){person.rotation.y=Math.PI/2;limbs[1].rotation.x=-.7-Math.sin(f*.6)*.7;limbs[3].rotation.x=-.7-Math.sin(f*.6)*.7;person.rotation.z=Math.sin(f*.6)*.07;}
   if(action==='sitting'||action==='rowing'){limbs[0].rotation.x=-1.4;limbs[2].rotation.x=-1.4;person.position.y=base.y-.3;limbs[1].rotation.x=action==='rowing'?-.7+Math.sin(f)*.4:-.6;limbs[3].rotation.x=limbs[1].rotation.x;}
  });return person;
 }
 function wake(parent,length=5){const shape=new T.Shape();shape.moveTo(0,0);shape.lineTo(-1.2,-length);shape.lineTo(-1,-length);shape.lineTo(0,-.8);shape.lineTo(1,-length);shape.lineTo(1.2,-length);shape.closePath();const geo=new T.ShapeGeometry(shape);geo.rotateX(-Math.PI/2);geometries.add(geo);const m=new T.Mesh(geo,material('#83c6c2'));m.position.set(0,.035,-2);parent.add(m);return m;}
 function boat(x,z,index,passenger=false,moored=false){const g=new T.Group();actors.add(g);g.position.set(x,.12,z);const hull=geometry('hull',()=>{const positions=[],indices=[],zs=[-2,-1.4,0,1.4,2],ws=[.05,.6,.72,.6,.05];for(let i=0;i<5;i++){positions.push(-ws[i],.4,zs[i],0,0,zs[i],ws[i],.4,zs[i]);if(i<4){const k=i*3;indices.push(k,k+3,k+1,k+1,k+3,k+4,k+1,k+4,k+2,k+2,k+4,k+5);}}const h=new T.BufferGeometry();h.setAttribute('position',new T.Float32BufferAttribute(positions,3));h.setIndex(indices);h.computeVertexNormals();return h;});
  const hullMesh=mesh(hull,'#815b3e',[0,0,0],[1,1,1],g);hullMesh.material.side=T.DoubleSide;for(let j=-2;j<=2;j++)box(0,.33,j*.58,1.05,.07,.25,'#d3a56a',g);for(const side of [-1,1])beam([side*.66,.44,-1.35],[side*.66,.44,1.35],.045,'#e6be84',g);
  human(0,.35,-.6,index,'rowing',g);if(passenger){for(const zz of [.3,1])human(0,.4,zz,index+2,'sitting',g);for(const side of [-1,1])for(const zz of [-1.1,1.1])cylinder(side*.6,1.1,zz,.045,1.5,'#805e42',g);box(0,1.85,0,1.6,.12,2.7,'#d99158',g);}
  const oars=[];for(const side of [-1,1]){const oar=new T.Group();oar.position.set(side*.55,.7,-.5);g.add(oar);beam([0,0,0],[side*1.4,-.3,.4],.045,'#c39965',oar);box(side*1.4,-.3,.4,.2,.05,.5,'#d1b28a',oar);oars.push(oar);}const trail=moored?null:wake(g);boats.push(g);
  animations.push(t=>{g.position.z=moored?z:z+Math.sin(t*.035+index)*8;g.rotation.y=moored?.12:Math.cos(t*.035+index)>0?0:Math.PI;g.rotation.z=Math.sin(t*1.4+index)*.018;g.position.y=.12+Math.sin(t*1.6+index)*.025;oars.forEach((o,i)=>o.rotation.y=Math.sin(t*2+index)*(i?-.35:.35));if(trail)trail.scale.x=1+Math.sin(t*2)*.1;});return g;
 }
 const waterUniforms={time:{value:0},highlight:{value:0}};
 const waterMat=new T.ShaderMaterial({uniforms:waterUniforms,side:T.DoubleSide,vertexShader:`varying vec3 vWorld; uniform float time; void main(){ vec3 p=position; p.y+=sin(p.x*.7+p.z*.35-time*1.3)*.025; vWorld=p; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.); }`,fragmentShader:`varying vec3 vWorld; uniform float time; uniform float highlight; void main(){vec2 p=vWorld.xz;float a=sin(p.y*2.3-time*1.9+sin(p.x*.8)*1.6);float b=sin(p.y*6.0-time*3.0+p.x*1.8);float glint=pow(max(0.,a*b),12.);float wide=sin(p.x*.12+p.y*.08)*.5+.5;vec3 c=mix(vec3(.075,.31,.34),vec3(.19,.46,.46),wide);c+=vec3(.22,.28,.24)*glint*.42;float trail=exp(-pow((p.x+sin(p.y*.07)*2.)/1.5,2.));c=mix(c,vec3(.54,.80,.76),trail*highlight*(.4+.2*sin(p.y*.6-time*2.)));float fog=smoothstep(65.,130.,length(vWorld));c=mix(c,vec3(.086,.231,.275),fog);gl_FragColor=vec4(c,1.);}`});materials.add(waterMat);
 const waterGeo=new T.PlaneGeometry(250,250,60,60);waterGeo.rotateX(-Math.PI/2);geometries.add(waterGeo);const water=new T.Mesh(waterGeo,waterMat);scene.add(water);
 let cutaway=null;
 function ghat(city){const hari=city==='haridwar',end=hari?24:30;island([[-52,-62],[-8,-62],[-8,62],[-52,62]],1.1,'#ab9068');walkSurfaces.push({minX:-52,maxX:-8,minZ:-62,maxZ:62,top:.45});groundBox(-28,1.5,-1,27,3,110,'#b59973');
  for(let i=0;i<12;i++){const x=-7.5-i*.7,y=-.24+i*.32;groundBox(x,y/2,0,.75,Math.max(.12,y),end*2,'#c7a575');groundBox(x,y+.035,0,.76,.07,end*2,'#dfc196');}
  // Upper promenade is kept clear of facades and walking paths.
  groundBox(-17,1.6,0,5,3.7,end*2+4,'#b59973');groundBox(-17,3.6,0,5,.3,end*2+4,'#e1c59b');
  for(let i=0;i<(hari?8:12);i++){const z=-end+3+i*(end*2-6)/(hari?7:11),height=3.5+(i*7%5)*.7;building(-24-(i%3)*1.6,3,z,7,height,4.2,['#bc7c54','#c89c73','#d5b283','#b78975','#d2c0a0'][i%5]);if(i%3===0)building(-33,3,z+1,6,height+3,4.5,'#b4a283');}
  for(const z of [-16,0,16]){pavilion(-17,3.8,z,.95);for(let j=0;j<4;j++)groundBox(-13-j*.6,2+j*.22,z+3,.62,.18,3,'#cfae7e');}
  temple(-26,8,-11,.85);temple(-29,7,12,.6);
  if(hari){island([[12,-65],[50,-65],[50,65],[12,65]],2.15,'#b59e79');for(let z=-40;z<40;z+=10)tree(20,1.5,z,.8);building(15,1.5,-16,2.2,9,2.2,'#d67c59');for(const side of [-1,1]){const face=cylinder(15+side*1.15,9,-16,.66,.07,'#f0dfb4');face.rotation.z=Math.PI/2;beam([15+side*1.2,9,-16],[15+side*1.2,9.4,-16],.04,'#5d6057');}pavilion(15,10.6,-16,.65);for(let z=-20;z<22;z+=3){cylinder(-7.7,.75,z,.045,1.5,'#69746a');if(z<19)beam([-7.7,1.2,z],[-7.7,1.2,z+3],.035,'#69746a');}}
  for(let i=0;i<8;i++){tree(-36,2,-30+i*9,.9);cylinder(-7.7,.3,-25+i*7,.09,.7,'#725a41');}
  const count=compact?12:18;for(let i=0;i<count;i++){const bath=i%4===0,sit=i%4===1,stairs=i%8===2,lane=stairs?(hari?(i===2?-22.5:23):(i===2?-21:7)):-end+3+i*(end*2-6)/count;human(bath?-7.1:sit?-11.7:-16.6,bath?-.15:sit?1.55:3.76,lane,i,bath?'bathing':sit?'sitting':stairs?'stairs':i%4===2?'walking':'standing');}
  if(!hari){boat(4,4,0,false);boat(9,-12,1,true);boat(-4,18,2,false,true);if(!compact)boat(13,20,3,false);}else boat(7,-16,0,false,true);
 }
 if(def.kind==='city'||def.kind==='ghat')ghat(def.kind==='city'?'varanasi':'haridwar');
 if(def.kind==='confluence'||def.kind==='sangam'){
  const mountain=def.kind==='confluence';island([[-55,-60],[-28,-60],[-8,-3],[-9,60],[-55,60]],mountain?3:1.1,mountain?'#708573':'#c9b188');island([[55,-60],[28,-60],[8,-3],[9,60],[55,60]],mountain?3:1,'#aaae89');island([[-18,-60],[18,-60],[0,-12]],mountain?7:1.3,mountain?'#778f78':'#d5bc91');
  if(mountain){for(let i=0;i<12;i++){const side=i%2?-1:1;mesh(coneGeo,'#577567',[side*(30+i%3*5),5,-40+i*7],[12,16+i%4*4,12]);box(-15-i%3*3,2.8+i%3,-18+i*4,3,1+i%3*2,3,'#9da185');building(-15-i%3*3,3.3+i%3*2,-18+i*4,3,3+i%3,3,['#d3b990','#c69b72','#e0cdb0'][i%3]);}temple(-18,6,-6,.85);for(let i=0;i<8;i++)box(-8-i*.55,1+i*.35,2,.6,.3,6,'#d5b78f');}
  else{for(let i=0;i<8;i++){tree(-26+i%3*5,.5,-22+i*7,.9);if(i<5)boat(-4+i*2.7,6+i%2*7,i,i===2);}box(-12,.55,5,5,.3,2,'#9d7752');for(let i=0;i<(compact?6:10);i++)human(-16-i%3*1.5,.6,1+i*1.6,i,i%2?'standing':'walking');}
 }
 if(def.kind==='source'){
  island([[-55,-70],[-6,-70],[-4,60],[-55,60]],.7,'#8f9688');island([[55,-70],[6,-70],[4,60],[55,60]],.7,'#9c9f91');
  for(let i=0;i<14;i++){const side=i%2?-1:1,x=side*(29+i%4*7),z=-70+Math.floor(i/2)*7,h=20+i%5*4;mesh(coneGeo,i%2?'#788f8b':'#96aaa4',[x,h*.5,z],[16,h,16]);mesh(coneGeo,'#dce8df',[x,h*.88,z],[3.86,h*.24,3.86]);}
  const ice=new T.Shape();ice.moveTo(-11,0);ice.lineTo(-11,6);ice.lineTo(-7,8);ice.lineTo(-4,7);ice.lineTo(0,9);ice.lineTo(4,7.5);ice.lineTo(8,8.5);ice.lineTo(11,6);ice.lineTo(11,0);ice.lineTo(2,0);ice.lineTo(2,1);ice.absarc(0,1,2,0,Math.PI,false);ice.lineTo(-2,0);ice.closePath();const iceGeo=new T.ExtrudeGeometry(ice,{depth:30,bevelEnabled:false,curveSegments:8});geometries.add(iceGeo);mesh(iceGeo,'#b6d2d0',[0,0,-55],[1,1,1]);
  for(let i=0;i<13;i++)if(i<4||i>8)rock(-10+i*1.7,3+(i%3)*1.5,-27-(i%2)*3,3,'#c1d8d4');
  for(let i=0;i<32;i++)rock((i%2?-1:1)*(5+i%5*1.7),.3,-20+i*2.5,.6+i%3*.35);
 }
 function car(index,bus=false,train=false,parent=actors){const g=new T.Group();parent.add(g);const length=train?6:bus?3.8:2.2,w=train?1.65:bus?1.25:1;box(0,.55,0,length,.6,w,train?'#bf7755':['#e7c67e','#e7e1d0','#668ea1'][index%3],g);box(0,1,0,length*.7,.55,w*.92,train?'#e4c897':'#9db6b3',g);box(0,1.31,0,length*.72,.1,w,'#ded6bc',g);for(const x of [-length*.32,length*.32])for(const z of [-w*.52,w*.52]){const wheel=cylinder(x,.28,z,.24,.12,'#303b3c',g);wheel.rotation.x=Math.PI/2;}vehicles.push(g);return g;}
 if(def.kind==='bridge'){
  island([[-80,-70],[-33,-70],[-33,70],[-80,70]],2,'#869775');island([[80,-70],[33,-70],[33,70],[80,70]],2,'#aab48c');
  box(0,5.2,0,145,.5,4,'#887f66');box(0,9.5,0,145,.55,5,'#b4b6a0');box(0,9.81,0,145,.06,4.6,'#6d7978');
  for(const z of [-1,1])beam([-75,5.55,z],[75,5.55,z],.075,'#c2c4b4');for(let x=-72;x<74;x+=1.4)box(x,5.51,0,.2,.12,2.8,'#78694f');
  for(let x=-60;x<=60;x+=15){cylinder(x,2.3,0,1.35,5.5,'#b8a587');box(x,5.0,0,3.6,.6,5,'#c9b896');}
  for(const side of [-1,1]){for(let x=-30;x<30;x+=5){beam([x,5.5,side*2],[x+5,9.1,side*2],.12,'#566d68');beam([x+5,5.5,side*2],[x,9.1,side*2],.12,'#566d68');beam([x,5.5,side*2],[x,9.1,side*2],.14,'#617970');}beam([-33,9.1,side*2],[33,9.1,side*2],.17,'#6e8074');beam([-73,10.35,side*2.45],[73,10.35,side*2.45],.045,'#bdc3a8');for(let x=-72;x<74;x+=3)cylinder(x,10.05,side*2.45,.035,.6,'#bdc3a8');}
  for(let x=-72;x<74;x+=3)box(x,9.85,0,1.2,.025,.07,'#eee1b5');
  for(let i=0;i<(compact?6:10);i++){const c=car(i,i===3);const direction=i%2?1:-1;animations.push(t=>{c.position.set(((t*3*direction+i*14+1400)%140)-70,9.85,direction*1.1);c.rotation.y=direction<0?Math.PI:0;});}
  const train=new T.Group();actors.add(train);for(let i=0;i<4;i++){const v=car(i,false,true,train);v.position.x=-i*6.6;}animations.push(t=>train.position.set((t*4%190)-80,5.55,0));
  for(const x of [-30,-15,0,15,30]){const group=new T.Group();group.position.set(x,0,1.4);group.rotation.y=Math.PI;root.add(group);wake(group,6);}
  for(let i=0;i<10;i++)tree(i%2?42:-42,1,-35+i*8,1.3);boat(8,27,1,false);
 }
 if(def.kind==='barrage'){
  island([[-65,-65],[-29,-65],[-29,2],[-60,18]],1.4,'#a7ad87');island([[-65,24],[-30,8],[-25,60],[-65,65]],1.3,'#bbb68c');island([[65,-65],[29,-65],[29,65],[65,65]],1.4,'#aab48b');
  cutaway=new T.Group();root.add(cutaway);box(0,5.5,0,65,.65,4,'#cbbf9e',cutaway);
  for(let x=-28;x<=28;x+=7){box(x,2.2,0,1,5.5,5,'#cab994');box(x,6.5,0,1.4,1.4,2,'#c9d2be',cutaway);if(x<28){box(x+3.5,3.8,0,5.8,2.4,.3,'#637f79');beam([x,7,0],[x+7,7,0],.15,'#929d89',cutaway);}}
  for(let i=0;i<5;i++)tree(36,1,-22+i*12,1.4);building(-36,.6,-14,6,4,8,'#d0b084');boat(10,25,2,true);
 }
 if(def.kind==='estuary'){
  island([[-70,-60],[-33,-60],[-21,-23],[-30,9],[-29,60],[-70,60]],1.1,'#879d77');island([[70,-60],[34,-60],[31,-12],[42,16],[31,60],[70,60]],1,'#9fac80');island([[12,-24],[19,-36],[23,-24],[21,-8],[16,-9]],.9,'#c9b78e');
  for(let i=0;i<16;i++){const side=i%2?1:-1;tree(side*(35+i%3*3),.5,-45+i*6,1.0);}for(let i=0;i<(compact?2:4);i++)boat(-5+i*6,-14+i*11,i,i%2===0);
 }
 const connections=new Map();
 const connectionPaths=def.kind==='confluence'?{bhagirathi:[[-21,0,-42],[-13,0,-24],[-3,0,-7],[0,0,18]],alaknanda:[[21,0,-42],[13,0,-24],[3,0,-7],[0,0,18]],ganga:[[0,0,-3],[0,0,12],[0,0,35]]}:def.kind==='sangam'?{yamuna:[[-23,0,-42],[-15,0,-24],[-3,0,-7],[0,0,20]],ganga:[[23,0,-42],[15,0,-24],[3,0,-7],[0,0,20]]}:def.kind==='barrage'?{padma:[[5,0,-12],[5,0,5],[5,0,35]],feeder:[[-10,0,-15],[-22,0,-8],[-28,0,7],[-48,0,18]]}:{};
 for(const [id,points] of Object.entries(connectionPaths)){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(p[0],.12,p[2]))),geo=new T.TubeGeometry(curve,64,.075,5,false);geometries.add(geo);const mat=new T.MeshBasicMaterial({color:id==='alaknanda'||id==='yamuna'?'#87e3d6':'#ffcf8c',transparent:true,opacity:.9});materials.add(mat);const line=new T.Mesh(geo,mat);line.visible=false;scene.add(line);connections.set(id,line);}
 // Batch shared shapes into instances. Actor source graphs remain available for animation.
 root.updateMatrixWorld(true);const batches=new Map();root.traverse(o=>{if(!o.isMesh)return;const key=o.geometry.uuid+o.material.uuid;let b=batches.get(key);if(!b){b={geo:o.geometry,mat:o.material,objects:[],dynamic:false};batches.set(key,b);}b.objects.push(o);let p=o;while(p){if(p.userData.dynamic||p===cutaway)b.dynamic=true;p=p.parent;}});
 const zero=new T.Matrix4().makeScale(0,0,0);for(const b of batches.values()){b.mesh=new T.InstancedMesh(b.geo,b.mat,b.objects.length);b.mesh.castShadow=true;b.mesh.receiveShadow=true;b.mesh.frustumCulled=false;if(b.dynamic)b.mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);scene.add(b.mesh);}
 function updateInstances(all=false){root.updateMatrixWorld(true);for(const b of batches.values()){if(!all&&!b.dynamic)continue;b.objects.forEach((o,i)=>{let visible=true,p=o;while(p){if(!p.visible)visible=false;p=p.parent;}b.mesh.setMatrixAt(i,visible?o.matrixWorld:zero);});b.mesh.instanceMatrix.needsUpdate=true;}}
 updateInstances(true);
 let clock=0;let focusVehicle=vehicles[0];const originalAnchors=def.points.map(p=>new T.Vector3(...p.position));
 return{scene,root,boats,vehicles,people,walkSurfaces,definition:def,waterUniforms,focus(id){if(id==='vehicle')focusVehicle=vehicles.filter(v=>v.parent===actors).reduce((a,b)=>Math.abs(a.position.x)<Math.abs(b.position.x)?a:b);},
  update(time,selected=null){clock=time;waterUniforms.time.value=time;waterUniforms.highlight.value=selected==='water'?.65:0;connections.forEach((line,id)=>line.visible=selected===id||selected==='connections');animations.forEach(fn=>fn(time));if(cutaway)cutaway.visible=selected!=='cutaway';updateInstances();},
  anchor(index){const p=def.points[index];if((p.view==='boat'||p.view==='follow')&&boats[0])return boats[0].getWorldPosition(new T.Vector3()).add(new T.Vector3(0,2,0));if(p.view==='vehicle'&&focusVehicle)return focusVehicle.getWorldPosition(new T.Vector3()).add(new T.Vector3(0,2,0));return originalAnchors[index].clone();},
  stats(){return{people:people.length,boats:boats.length,vehicles:vehicles.length,drawBatches:batches.size,activityTime:+clock.toFixed(2),highlightedConnections:[...connections].filter(([,line])=>line.visible).map(([id])=>id),cutaway:cutaway?!cutaway.visible:false};},
  dispose(){for(const b of batches.values())b.mesh.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());sun.shadow.map?.dispose();scene.clear();root.clear();}
 };
}
