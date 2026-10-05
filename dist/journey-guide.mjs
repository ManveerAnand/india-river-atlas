import {notesFor,noteIndex} from './guide-data.mjs?v=3.7';
const $=id=>document.getElementById(id);
export class JourneyGuide{
 constructor(state,play){this.state=state;this.play=play;this.key=null;this.override=null;this.index=0;this.notes=[];this.paintKey=null;
  $('guide-previous').onclick=()=>this.browse(-1);$('guide-next').onclick=()=>this.browse(1);
  $('guide-hold').onclick=()=>{if(state.reading){this.override=null;play();}else this.hold();};
 }
 reset(){this.state.reading=false;this.key=null;this.override=null;this.paintKey=null;}
 hold(){this.override=this.index;this.state.reading=true;this.state.playing=false;this.state.activityPaused=false;}
 browse(direction){if(!this.notes.length)return;this.hold();this.override=Math.max(0,Math.min(this.notes.length-1,this.index+direction));}
 sync(sample,river,isLocal,free){
  const notes=notesFor(sample,river),key=notes.length?`${sample.chapter.scene}-${sample.travelling}`:null;
  if(key!==this.key){this.key=key;this.override=null;this.state.reading=false;this.paintKey=null;}
  this.notes=notes;const visible=notes.length>0&&!free;
  const parent=isLocal?$('local-panel'):$('story-card'),guide=$('journey-guide');
  if(guide.parentElement!==parent)parent.insertBefore(guide,isLocal?$('local-actions'):$('next-journeys'));
  guide.hidden=!visible;document.body.classList.toggle('guided-notes',visible);$('local-panel').classList.toggle('has-guide',!!isLocal&&visible);$('story-card').classList.toggle('has-guide',!isLocal&&visible);
  const speed=$('speed-control'),speedParent=isLocal?$('local-locator'):$('speed-slot');if(speed.parentElement!==speedParent)speedParent.append(speed);
  if(!visible)return;
  if(!this.state.reading)this.override=null;
  this.index=this.override??noteIndex(sample.phase,notes.length);
  const n=notes[this.index],paintKey=`${key}-${this.index}-${this.state.reading}`;
  if(paintKey===this.paintKey)return;this.paintKey=paintKey;
  $('guide-kind').textContent=n.kind;$('guide-title').textContent=n.title;$('guide-text').textContent=n.text;
  $('guide-position').textContent=`${this.index+1} / ${notes.length}`;
  $('guide-context').textContent=sample.travelling?`${sample.previous.short} → ${sample.chapter.short}`:`Your guide · ${sample.chapter.short}`;
  $('guide-previous').disabled=this.index===0;$('guide-next').disabled=this.index===notes.length-1;
  $('guide-hold').textContent=this.state.reading?'Continue journey →':'Read at my pace';$('guide-hold').setAttribute('aria-pressed',String(this.state.reading));
  $('guide-status').textContent=this.state.reading?'Journey held · browse the notes at your pace':'Notes follow the journey · pause here to read';
  const a=$('guide-source');a.hidden=!n.source;if(n.source){a.textContent=n.source[0]+' ↗';a.href=n.source[1];}else a.removeAttribute('href');
 }
 snapshot(){return this.notes.length?{location:this.key,index:this.index,count:this.notes.length,title:this.notes[this.index]?.title,reading:this.state.reading}:null;}
}
