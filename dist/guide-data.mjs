// Editorial content is independent of cameras and model coordinates.
const source={
 course:['National Mission for Clean Ganga','https://www.nmcg.nic.in/courseofganga.aspx'],
 glacier:['Uttarkashi district','https://uttarkashi.nic.in/tourist-place/gomukh/'],
 dev:['Tehri Garhwal district','https://tehri.nic.in/tourist-place/devprayag/'],
 hari:['Haridwar district','https://haridwar.nic.in/tourist-place/har-ki-pauri/'],
 sangam:['Incredible India · Sangam','https://www.incredibleindia.gov.in/en/uttar-pradesh/prayagraj/triveni-sangam'],
 kashi:['Incredible India · Dashashwamedh','https://www.incredibleindia.gov.in/en/uttar-pradesh/varanasi/dashashwamedh-ghat'],
 city:['Incredible India · Varanasi','https://www.incredibleindia.gov.in/en/uttar-pradesh/varanasi'],
 farakka:['Farakka Barrage Project','https://fbp.gov.in/index.html'],
 sediment:['USGS · Water glossary','https://water.usgs.gov/water-basics_glossary.html'],
 delta:['USGS · Rivers and deltas','https://pubs.usgs.gov/of/2003/of03-337/rivers-deltas.html']
};
const note=(kind,title,text,ref)=>({kind,title,text,source:source[ref]||null});
export const locationNotes={
 gaumukh:[
  note('WELCOME TO GAUMUKH','Begin with a trickle','Look for the opening in the ice. At Gangotri Glacier, the Bhagirathi begins its journey. We are following one important headstream of the Ganga, not the source of every Indian river.','glacier'),
  note('A NAME TO REMEMBER','Bhagirathi comes first','Keep this name in mind as we leave the glacier. At Devprayag, the Bhagirathi will meet the Alaknanda; their joined waters take the name Ganga.','dev'),
  note('LOOK CLOSER','Find the smallest channel','Trace the miniature’s water from the ice opening into the valley. The enormous mountains and the little channel make an interesting pair: a great river can have a modest-looking beginning.'),
  note('COMING UP','Two valleys, one meeting','Next we follow the Bhagirathi to Devprayag. Watch for a second river approaching. The important moment is a joining, rather than a river splitting in two.','dev')],
 devprayag:[
  note('WELCOME TO DEVPRAYAG','Here, the name changes','Bhagirathi on one approach, Alaknanda on the other: this is the junction where the river becomes Ganga. Follow both approaches with your eyes before looking downstream.','dev'),
  note('DID YOU KNOW?','One of five sacred meetings','Devprayag is one of the five sacred prayags, or confluences, associated with the Alaknanda. The town sits around the meeting of the two rivers.','dev'),
  note('TRY SPOTTING IT','Two in, one out','The temporary bright trails help you read the junction. Can you find the two incoming paths and the single outgoing path? Those trail colours explain the scene; they are not permanent water colours.'),
  note('COMING UP','From valleys to the plains','Our next stop is Haridwar, where the Ganga opens onto the Gangetic plains. We will move from a mountain junction to a riverfront shaped around people.','course')],
 haridwar:[
  note('WELCOME TO HARIDWAR','Meet the river at Har Ki Pauri','We have reached the stepped waterfront of Har Ki Pauri. Begin at the upper terrace, then let your eyes follow the stairways down to the water.','hari'),
  note('A BIG CHANGE','Room to spread out','At Haridwar, the Ganga reaches the Gangetic plains. Water is also diverted into the Upper Ganga Canal for irrigation: the river’s story extends beyond its main channel.','course'),
  note('LOOK CLOSER','A staircase with many rhythms','Find someone walking, someone resting, and someone bathing in the shallows. In this miniature, the steps connect those activities with the terraces and streets above. Try the river-edge viewpoint.'),
  note('COMING UP','A much larger meeting','Next comes Prayagraj and the Sangam. Keep the Devprayag junction in mind: we will compare that compact mountain meeting with a broad confluence on the plains.')],
 prayagraj:[
  note('WELCOME TO PRAYAGRAJ','Two visible river journeys meet','This is the Sangam, where the Yamuna meets the Ganga. Try the boat viewpoint first, then rise above the water to see how the approaches fit together.','course'),
  note('CULTURE & GEOGRAPHY','Why “Triveni”?','Triveni Sangam is understood in Hindu tradition as a meeting of three rivers, including the unseen Saraswati. The mapped surface channels here show the Ganga and Yamuna.','sangam'),
  note('DID YOU KNOW?','The river carries more than water','Alluvium is sediment left by flowing water: it can include sand, silt, clay and gravel. Look at the miniature’s sandbanks and imagine the river carrying and depositing these materials.','sediment'),
  note('COMING UP','From a junction to a city','Our next stop is Varanasi. The camera will trade this broad view for close waterfront detail: steps, boats, terraces and the people moving between them.')],
 varanasi:[
  note('WELCOME TO VARANASI','Take a seat by the ghats','Welcome to our Dashashwamedh-inspired waterfront. Let your eyes travel from the boats to the steps and up into the lanes. Each level gives you a different view of riverfront life.'),
  note('WHEN EVENING COMES','A riverfront of lamps','Dashashwamedh Ghat is known for its evening Ganga Aarti, with prayers and lamps offered in honour of the river. Our daylight scene shows another side of the same waterfront.','kashi'),
  note('DID YOU KNOW?','A city with its own soundtrack','Varanasi belongs to UNESCO’s Creative Cities Network as a City of Music. Its riverfront is also known for gatherings such as Subah-e-Banaras at Assi Ghat, combining music, yoga and devotion.','city'),
  note('LOOK, THEN FOLLOW','Three levels, countless stories','Find a rowing boat, a person on the steps, and a pavilion above them. Which viewpoint tells the best story? Next, we stay in Varanasi to pass beneath Malviya Bridge.')],
 malviya:[
  note('WELCOME TO THE CROSSING','Three journeys in one view','Look up for road traffic, look below it for the train, and then down again for the river. This miniature separates the crossing into three easy-to-follow levels.'),
  note('LOOK CLOSER','Follow the triangles','Find the repeated triangles in the bridge’s steelwork. The miniature’s trusses span between the piers. Choose “Explore the bridge” for a closer look at how the crossing is arranged.'),
  note('BENEATH THE BRIDGE','The river gets the lower route','As we pass through a clear span, watch the water around the piers. Compare the boat’s wake with the surface marks downstream of a pier. Both are illustrative motion cues.'),
  note('COMING UP','A crossing, then a diversion','We are heading to Farakka next. Here the structure carries traffic over the river; there, the story will be about directing some of the river’s water along a different route.')],
 farakka:[
  note('WELCOME TO FARAKKA','A choice of onward routes','The scene now introduces a diversion. Some water is directed toward the Bhagirathi–Hooghly system; our main mapped journey continues toward the Padma.','farakka'),
  note('DID YOU KNOW?','A canal about 38 kilometres long','The Farakka project’s feeder canal is 38.38 kilometres long. It was built to direct Ganga water into the Bhagirathi–Hooghly system, supporting navigation and the maintenance of Kolkata Port.','farakka'),
  note('TRY THE CUTAWAY','See beneath the deck','Select “Look inside the barrage” to reveal the gate openings. Then select the feeder route. This miniature explains the connections; its water patterns do not simulate real gate operations.'),
  note('COMING UP','Beyond one country’s border','Next we follow the Padma into Bangladesh and toward the shared lower river system. The geographic journey continues across the border, just as the connected water does.','course')],
 estuary:[
  note('WELCOME TO THE LOWER SYSTEM','Different beginnings, shared waters','The Padma connects with the Brahmaputra and Meghna before the waters reach the Bay of Bengal. Think back to the tiny headstream at the start of our journey.','course'),
  note('DID YOU KNOW?','Rivers can help build land','A delta can form when a river supplies more sediment to a coast than marine processes redistribute. Water carries the material; accumulation helps shape new land.','delta'),
  note('READING THIS MAP','The line stops before the water does','Our mapped endpoint is upstream of the open sea. This broad-water miniature suggests the lower estuary; its islands are illustrative and do not map every distributary.'),
  note('YOUR JOURNEY, RECAPTURED','Can you recall the two meetings?','Devprayag brought Bhagirathi and Alaknanda together. At Prayagraj, the Yamuna joined the Ganga. Return to the whole route and pick a favourite stop to revisit.')]
};
export const travelNotes={
 devprayag:[note('ON THE WAY','Following the Bhagirathi','We are leaving Gaumukh for Devprayag. Stay with the highlighted channel through the mountains; a second headstream is waiting at the next stop.'),note('WATCH FOR THE ARRIVAL','A river is about to get a new name','At the next junction, look for the Alaknanda approach. Follow the joined water out of the meeting: that is where our Ganga chapter begins.','dev')],
 haridwar:[note('ON THE WAY','Devprayag → Haridwar','We have left the confluence behind. Our next close view is Har Ki Pauri, where a stepped waterfront brings people down to the Ganga.'),note('WATCH THE LANDSCAPE','The plains are ahead','Haridwar marks the Ganga’s arrival on the Gangetic plains. As the camera approaches, look for the change from mountain relief to a more open landscape.','course')],
 prayagraj:[note('ON THE WAY','Across the plains to Prayagraj','Our next stop is the Sangam. Along this part of its course, the Ganga also receives the Ramganga near Kannauj. Our chapter stops sample a much longer journey.','course'),note('READY FOR THE MEETING?','Look for the Yamuna','At Prayagraj, watch for another river approaching the Ganga. Try to identify each approach before the camera rises above the junction.')],
 varanasi:[note('ON THE WAY','Prayagraj → Varanasi','Leave the broad confluence behind and watch the Ganga continue toward our next waterfront. We will slow down to look at boats, bathing steps and the terraces above.'),note('BEFORE WE ARRIVE','A ghat is more than a viewpoint','At Varanasi, start with the water, then look up through the steps to the city. Try spotting the route a person might take from a lane down to a boat.')],
 malviya:[note('ON THE WAY','Still in Varanasi','This is a short hop from the waterfront to Malviya Bridge. Keep looking downstream: our next camera passage takes us beneath the crossing.'),note('YOUR NEXT CHALLENGE','Find the three levels','When the bridge appears, look for road vehicles, the railway and the river below. Then choose one crossing to follow.')],
 farakka:[note('ON THE WAY','Varanasi → Farakka','We are following a long downstream stretch toward West Bengal. The map compresses the journey between our selected stops; these seconds are not real travel time.'),note('BEFORE WE ARRIVE','Joining and diverting are different','We have already seen rivers come together. Farakka introduces a different idea: directing some water into a feeder connection. Watch for the selectable onward routes.')],
 estuary:[note('ON THE WAY','Toward the shared lower system','We leave Farakka and follow the Padma route toward Bangladesh. Watch the small route locator when we arrive: it will show how far this journey has come.'),note('THE LAST APPROACH','One last look at the whole story','We are nearing the mapped endpoint, not the end of the water’s journey. Soon we will pull back and trace the complete route from the Himalayan headwaters.')]
};
export function notesFor(sample,river){if(river!=='ganga'||!sample?.chapter.scene)return [];return (sample.travelling?travelNotes:locationNotes)[sample.chapter.scene]||[];}
export const playbackSpeeds=[.5,1,1.5,2,3];
export function noteIndex(phase,count){return Math.max(0,Math.min(count-1,Math.floor(Math.max(0,phase)*count)));}
