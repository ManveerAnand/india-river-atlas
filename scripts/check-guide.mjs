import assert from 'node:assert/strict';
import {sceneOrder} from '../dist/scene-data.mjs';
import {locationNotes,mapNotes,travelNotes,notesFor,noteIndex,playbackSpeeds} from '../dist/guide-data.mjs';
for(const [i,id] of sceneOrder.entries()){
 assert.equal(mapNotes[id].length,2,`${id} needs two map notes`);
 assert.equal(locationNotes[id].length,4,`${id} needs four destination notes`);
 if(i)assert.equal(travelNotes[id].length,2,`${id} needs incoming travel guidance`);
 for(const n of [...mapNotes[id],...locationNotes[id],...(travelNotes[id]||[])]){assert(n.title&&n.kind&&n.text);assert(n.text.split(/\s+/).length<=48,'Keep each note readable');if(n.source)assert.equal(new URL(n.source[1]).protocol,'https:');}
 for(const travelling of [false,true]){const s={chapter:{scene:id},travelling};assert.deepEqual(notesFor(s,'ganga'),(travelling?travelNotes:locationNotes)[id]||[]);assert.deepEqual(notesFor(s,'ganga',false),(travelling?travelNotes:mapNotes)[id]||[]);assert.deepEqual(notesFor(s,'brahmaputra'),[]);}
}
assert.equal(noteIndex(0,4),0);assert.equal(noteIndex(.249,4),0);assert.equal(noteIndex(.25,4),1);assert.equal(noteIndex(1,4),3);
assert.deepEqual(playbackSpeeds,[.5,1,1.5,2,3]);
console.log('16 map notes, 32 destination notes, 14 travel notes, chapter isolation and deterministic note boundaries passed.');
