import {sceneDefinitions,sceneOrder} from './scene-data.mjs?v=3.3';
export const destinations = {
  all: {name:'All destinations',color:'#91dce6',text:'Start in the mountains and plateaus. Follow the river systems toward their destinations.'},
  bay: {name:'Bay of Bengal',color:'#8ce6ed',text:'Ganga–Brahmaputra and the great east-flowing rivers of the peninsula reach the Bay of Bengal.'},
  arabian: {name:'Arabian Sea',color:'#ffca8a',text:'The Indus, Narmada, Tapi and many short west-coast rivers drain toward the Arabian Sea.'},
  inland: {name:'Inland & arid drainage',color:'#c7b2ff',text:'Some water ends in lakes, depressions and arid lowlands. Follow the seasonal Luni toward the Rann.'}
};
export function destinationOf(r){return r.id==='luni'?'inland':r.outlet.includes('Arabian')?'arabian':'bay';}

// Anchors locate chapters on the published river geometry; they do not replace it.
export const riverStops = {
ganga:[
 {at:0,short:'Gaumukh',title:'Before it is called Ganga',kind:'HEADWATERS',text:'Our journey begins near Gaumukh, in the Bhagirathi headwaters. The camera descends into the valley where this source stream begins its journey.',distance:3.5,bearing:1.0},
 {at:[78.60,30.15],short:'Devprayag',title:'Two rivers become the Ganga',kind:'CONFLUENCE',text:'The Alaknanda enters from another Himalayan valley. Watch the two channels meet at Devprayag: downstream of this junction, the river is called Ganga.',distance:2.6,bearing:1.1,branch:'alaknanda'},
 {at:[78.17,29.95],short:'Haridwar',title:'The valley opens into a plain',kind:'CHANGE OF LANDSCAPE',text:'At Haridwar, the Ganga emerges onto the plains. Pull back from the mountain valleys and follow the river across much gentler terrain.',distance:3.8,bearing:.7},
 {at:[81.88,25.43],short:'Prayagraj',title:'A second great journey joins',kind:'CONFLUENCE',text:'The Yamuna meets the Ganga at Prayagraj. Its highlighted approach reveals how two separate headwater journeys become one downstream flow.',distance:3.0,bearing:.8,branch:'yamuna'},
 {at:[83.01,25.31],short:'Varanasi',title:'Following the river through Varanasi',kind:'RIVER & CITY',text:'The camera follows the bend by Varanasi, then continues downstream. Use the surrounding channels to see the river as part of a much larger network.',distance:2.6,bearing:1.7},
 {at:[87.93,24.80],short:'Farakka',title:'The delta has more than one path',kind:'DISTRIBUTARIES',text:'Near Farakka, water is routed toward the Bhagirathi–Hooghly and the Padma. This tour follows the mapped Padma route into Bangladesh; it does not show every delta branch.',distance:4.5,bearing:1.2},
 {at:1,short:'Estuary',title:'A shared destination',kind:'MAPPED OUTLET',text:'The Padma joins the Brahmaputra–Meghna system. Our mapped channel stops in the estuary; the water continues toward the Bay of Bengal. Pull back to see the whole journey.',distance:7,bearing:.2}
],
brahmaputra:[
 {at:0,short:'Tibet',title:'A river begins beyond India',kind:'HEADWATERS',text:'Begin in the Tibetan Himalayan headwater region. The upper river is the Yarlung Tsangpo; its journey crosses borders before reaching Assam.',distance:3.8,bearing:1.6},
 {at:[90.95,29.27],short:'Tsangpo',title:'Along the Tibetan Plateau',kind:'UPPER RIVER',text:'Follow the long eastward course across Tibet. Keep the Himalayan relief in view as the river approaches the eastern end of the mountain arc.',distance:4.2,bearing:1.8},
 {at:[95.0,29.72],short:'Great bend',title:'Turning through the mountains',kind:'CHANGE OF DIRECTION',text:'The river makes its great turn around the eastern Himalaya. The camera swings with the channel as it descends toward India.',distance:3.3,bearing:.1},
 {at:[95.35,28.1],short:'Assam',title:'From Siang to Brahmaputra',kind:'TRIBUTARIES JOIN',text:'The Siang enters upper Assam, where the Dibang and Lohit contribute to the system. A wide view reveals waterways arriving from different valleys.',distance:4.8,bearing:.8},
 {at:[91.74,26.18],short:'Guwahati',title:'Across the Assam valley',kind:'RIVER & CITY',text:'Pass Guwahati and follow the westward course across Assam. The main channel shown here simplifies a river with many braided channels.',distance:3.4,bearing:-.6},
 {at:[89.70,24.60],short:'Jamuna',title:'A new name in Bangladesh',kind:'CROSSING A BORDER',text:'In Bangladesh, this main course is called the Jamuna. Continue south toward the Padma and lower Meghna system.',distance:4,bearing:.5},
 {at:1,short:'Estuary',title:'The two journeys meet',kind:'MAPPED OUTLET',text:'The Brahmaputra and Ganga journeys share a lower outlet system. The mapped line ends in the estuary, upstream of the open Bay of Bengal.',distance:7,bearing:.2}
],
yamuna:[
 {at:[77.25,28.65],short:'Delhi',title:'A Himalayan river reaches Delhi',kind:'RIVER & CITY',text:'Follow the Yamuna past Delhi. Its journey began in a different Himalayan valley from the Bhagirathi.',distance:3.1},
 {at:[78.04,27.19],short:'Agra',title:'Through the plains at Agra',kind:'MIDDLE COURSE',text:'The camera follows the Yamuna through the plains. Farther downstream, this river will join the Ganga.',distance:3.2},
 {at:[81.88,25.43],short:'Prayagraj',title:'The Yamuna joins the Ganga',kind:'CONFLUENCE',text:'The Yamuna ends as a named river at this junction. The water continues along the Ganga, then the shared lower estuary system.',distance:3.3}
],
indus:[
 {at:[77.58,34.10],short:'Ladakh',title:'Between the mountain ranges',kind:'LADAKH',text:'Follow the upper Indus through Ladakh. The camera looks along the river corridor with the surrounding high terrain still visible.',distance:4},
 {at:[70.70,29.10],short:'Panjnad',title:'The Punjab rivers join the Indus',kind:'CONFLUENCE REGION',text:'The Punjab river system reaches the Indus through the Panjnad. The route now continues south across Pakistan.',distance:4.2}
],
godavari:[
 {at:[73.79,20.0],short:'Nashik',title:'From the Ghats into the interior',kind:'UPPER COURSE',text:'The Godavari begins in the Western Ghats, but its journey leads across the peninsula toward the east coast.',distance:3},
 {at:[77.31,19.15],short:'Nanded',title:'Across the Deccan',kind:'MIDDLE COURSE',text:'Trace the channel past the Nanded region. Nearby tributaries show how a river gathers water over a broad interior landscape.',distance:3.5},
 {at:[81.76,17.0],short:'Lower river',title:'Approaching the coastal delta',kind:'LOWER COURSE',text:'Near Rajamahendravaram, the river approaches its delta. The tour follows one mapped route toward the Bay of Bengal.',distance:4}
],
krishna:[
 {at:[78.26,15.95],short:'Tungabhadra',title:'The Tungabhadra joins',kind:'CONFLUENCE',text:'Another major peninsular river enters the Krishna system. The meeting of channels connects two upstream journeys.',distance:3.5},
 {at:[80.61,16.50],short:'Vijayawada',title:'The final approach to the coast',kind:'LOWER COURSE',text:'Pass the Vijayawada region before following the lower Krishna toward its coastal outlet.',distance:3.5}
],
kaveri:[
 {at:[76.69,12.43],short:'Srirangapatna',title:'Across the Karnataka plateau',kind:'MIDDLE COURSE',text:'From the Brahmagiri Hills, follow the Kaveri eastward through Karnataka. The view opens over the plateau around Srirangapatna.',distance:3.3},
 {at:[78.69,10.85],short:'Tiruchirappalli',title:'Approaching the delta',kind:'LOWER COURSE',text:'The river reaches the Tiruchirappalli region. Its delta has several channels; this tour follows the principal downstream link in the dataset.',distance:3.6}
],
narmada:[
 {at:[79.94,23.10],short:'Jabalpur',title:'A journey toward the west',kind:'RIFT VALLEY',text:'Follow the Narmada through the Jabalpur region. This major peninsular river flows west, between the Vindhya and Satpura ranges.',distance:3.4},
 {at:[72.99,21.69],short:'Bharuch',title:'Toward the Gulf of Khambhat',kind:'LOWER COURSE',text:'The camera widens near Bharuch as the Narmada approaches its estuary on the Arabian Sea side of India.',distance:4.5}
],
mahanadi:[
 {at:[83.86,21.52],short:'Hirakud',title:'Through the Hirakud region',kind:'MIDDLE COURSE',text:'Follow the Mahanadi downstream through the Hirakud region, keeping its surrounding tributaries in view.',distance:4},
 {at:[85.88,20.49],short:'Cuttack',title:'The delta begins to open',kind:'LOWER COURSE',text:'Near Cuttack, the Mahanadi approaches its delta. Continue along the mapped main route to the coastal outlet.',distance:4}
],
beas:[{at:[74.95,31.16],short:'Harike',title:'The Beas meets the Sutlej',kind:'CONFLUENCE',text:'At Harike, the Beas joins the Sutlej. The journey continues through the Indus system toward the Arabian Sea.',distance:3.5}],
sutlej:[{at:[74.95,31.16],short:'Harike',title:'The Beas joins the Sutlej',kind:'CONFLUENCE',text:'At Harike, another Himalayan river enters the Sutlej. Follow the connected route onward into the Indus system.',distance:3.5}]
};

export const overviewStops = [
 {short:'The network',title:'Many beginnings. Connected journeys.',kind:'INDIA · THE BIG PICTURE',text:'Rivers begin across many mountain ranges, plateaus and hills. Tributaries usually join downstream. Start with the whole landscape, then follow where the water goes.',center:[81.5,22],distance:34,bearing:.12,group:'all'},
 {short:'Himalayas',title:'Headwaters across the mountain arc',kind:'SOURCE REGIONS',text:'The Himalayan systems include the Indus, Ganga and Brahmaputra. Their sources are separate, and parts of their journeys lie outside India.',center:[83,30.6],distance:17,bearing:.3,group:'himalaya'},
 {short:'Peninsula',title:'The plateau sends water both ways',kind:'SOURCE REGIONS',text:'Peninsular rivers begin in the Ghats and interior highlands. The terrain separates eastward and westward journeys.',center:[77.8,17.5],distance:18,bearing:.15,group:'peninsula'},
 {short:'Bay of Bengal',title:'The great eastward journeys',kind:'DESTINATION 01',text:'Ganga–Brahmaputra and rivers including Godavari, Krishna, Kaveri and Mahanadi reach the Bay of Bengal. The blue routes show selected examples.',center:[85.5,20],distance:26,bearing:.1,group:'bay'},
 {short:'Arabian Sea',title:'Westward to the Arabian Sea',kind:'DESTINATION 02',text:'The Indus reaches the sea through Pakistan. Narmada and Tapi cross the peninsula westward; shorter rivers descend from the Western Ghats. Gold marks these examples.',center:[73,24],distance:27,bearing:-.15,group:'arabian'},
 {short:'Arid lowlands',title:'Not every journey reaches open sea',kind:'INLAND & ARID DRAINAGE',text:'Water can end in lakes or arid depressions. The seasonal Luni runs toward the Rann of Kachchh; its presence on a map does not mean it flows all year.',center:[72,25.5],distance:12,bearing:.6,group:'inland'},
 {short:'Choose a river',title:'Now follow one complete journey',kind:'YOUR NEXT JOURNEY',text:'Choose a river to descend toward its headwaters, travel along the channel and stop at important places. Start with the Ganga or Brahmaputra.',center:[81.5,22],distance:33,bearing:.12,group:'all',final:true}
];

// The bridge sits downstream of the Varanasi waterfront, before Farakka.
riverStops.ganga.splice(5,0,{at:[83.039,25.323],short:'Malviya Bridge',title:'Two banks, connected',kind:'RIVER CROSSING',text:sceneDefinitions.malviya.text,distance:2.6,bearing:1.7});
riverStops.ganga.forEach((stop,i)=>{const id=sceneOrder[i],def=sceneDefinitions[id];stop.scene=id;stop.hold=def.hold;stop.title=def.caption;stop.text=def.text;});
