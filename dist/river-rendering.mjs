import * as THREE from 'three';
import {pathMetric} from './story-engine.mjs?v=4.0';

// Atlas strokes keep their width in screen pixels, even at a national scale.
export function createRiverRibbon(points, color, width=4, opacity=1, flow=false){
 const metric=pathMetric(points),positions=[],tangents=[],sides=[],along=[],indices=[];
 for(let i=0;i<points.length;i++){
  const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)];
  const tangent=new THREE.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]).normalize();
  for(const side of [-1,1]){positions.push(points[i][0],points[i][1]+.07,points[i][2]);tangents.push(...tangent.toArray());sides.push(side);along.push(metric.cumulative[i]/metric.total);}
  if(i<points.length-1){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}
 }
 const geometry=new THREE.BufferGeometry();
 for(const [name,array,size] of [['position',positions,3],['tangent',tangents,3],['side',sides,1],['along',along,1]])geometry.setAttribute(name,new THREE.Float32BufferAttribute(array,size));
 geometry.setIndex(indices);
 const uniforms={color:{value:new THREE.Color(color)},opacity:{value:opacity},width:{value:width},resolution:{value:new THREE.Vector2(1,1)},time:{value:0},flow:{value:flow?1:0}};
 const material=new THREE.ShaderMaterial({uniforms,transparent:true,opacity,depthTest:false,depthWrite:false,side:THREE.DoubleSide,toneMapped:false,
  vertexShader:`attribute vec3 tangent; attribute float side; attribute float along; uniform vec2 resolution; uniform float width; varying float vAlong;
   void main(){vec4 clip=projectionMatrix*modelViewMatrix*vec4(position,1.);vec4 ahead=projectionMatrix*modelViewMatrix*vec4(position+tangent,1.);
   vec2 delta=(ahead.xy/max(.001,ahead.w)-clip.xy/max(.001,clip.w))*resolution;
   vec2 direction=delta/max(length(delta),.001);vec2 normal=vec2(-direction.y,direction.x);
   clip.xy+=normal*side*width/resolution*clip.w;gl_Position=clip;vAlong=along;}`,
  fragmentShader:`uniform vec3 color;uniform float opacity;uniform float time;uniform float flow;varying float vAlong;
   void main(){float pulse=pow(max(0.,cos(vAlong*160.-time*3.4)),10.);gl_FragColor=vec4(mix(color,vec3(1.,.98,.78),flow*pulse*.65),opacity);}`});
 const mesh=new THREE.Mesh(geometry,material);mesh.renderOrder=5;mesh.frustumCulled=false;
 mesh.userData.original=geometry.attributes.position.array.slice();
 mesh.onBeforeRender=renderer=>{renderer.getSize(uniforms.resolution.value);uniforms.opacity.value=material.opacity;};
 return mesh;
}

// Reconstruct the partial last segment after a seek, including backward seeks.
export function revealRiverRibbon(mesh,sample){
 const a=mesh.geometry.attributes.position,original=mesh.userData.original,previous=mesh.userData.previous;
 if(previous!==undefined)for(let k=0;k<6;k++)a.array[previous*6+k]=original[previous*6+k];
 for(let side=0;side<2;side++)for(let k=0;k<3;k++)a.array[sample.index*6+side*3+k]=sample.point[k]+(k===1?.07:0);
 mesh.userData.previous=sample.index;a.needsUpdate=true;
 mesh.geometry.setDrawRange(0,sample.index*6);
}
