# India River Atlas — browser prototype and Blender plan

## The learning experience

Begin with a seven-scene introduction: the national network, Himalayan sources, peninsular sources, Bay of Bengal, Arabian Sea, inland and arid drainage, then the choice of an individual river. Destination filters group the featured journeys and stationary arrows indicate downstream direction.

Selecting a river immediately flies the camera from the national view to the source region. Play its guided journey to follow a growing route trace, slow down at landmarks and hold for explanatory captions. Chapter buttons and the chapter selector jump directly to stops. Dragging the map pauses the tour and offers a visible Resume guided camera action.

The central geographic lesson is that India's rivers have many origins. Tributaries normally join downstream; distributaries split, particularly in deltas. Show transboundary sources and outlets because the Indus, Ganga and Brahmaputra systems extend beyond India.

## Browser implementation

- Real elevation rendered as a navigable 3D terrain mesh, with about 44× vertical exaggeration for visibility at national scale.
- HydroRIVERS v1 Asia network: 255,319 mapped reaches intersect the Natural Earth India boundary. Connected basins are retained within 64–99°E and 4–38°N for cross-border context.
- Nineteen selectable journeys: Ganga, Brahmaputra, Indus, Yamuna, Godavari, Krishna, Kaveri, Narmada, Tapi, Mahanadi, Mahi, Sabarmati, Luni, Pennar, Subarnarekha, Brahmani, Periyar, Beas and Sutlej.
- A progressive river ribbon and tracked position marker; chapter-paced travel, source fly-ins, approach shots, gentle landmark camera moves and a final pullback. Continuous looping particles have been removed.
- Ganga has eight stops: Gaumukh, Devprayag, Haridwar, Prayagraj, Varanasi, Malviya Bridge, Farakka and the shared lower estuary. Brahmaputra also has seven stops, including the Tibetan course, great bend, Assam, Guwahati, Jamuna and estuary.
- The Alaknanda and Yamuna approaches at the Ganga confluences use actual HydroRIVERS graph connections and reveal in a second colour. Every river has a source, intermediate story and mapped-outlet chapter; several have additional curated landmarks.
- Play/pause, chapter navigation, presentation-timeline scrubbing and explicit return to guided camera. Source-region labels and confluence/place captions follow the active chapter. Tributary journeys continue through the receiving river to the mapped outlet.
- Smaller-tributary and terrain toggles, orbit/zoom/pan controls and a narrow-screen layout.

## Accuracy and coverage

This is a geographic flow illustration, not a hydraulic or flood model. The timeline now measures presentation time, including chapter holds. Travel along a leg uses the route's planimetric length, with eased starts and arrivals; it does not represent water speed or real travel time.

HydroRIVERS represents rivers with catchment area at least 10 km² or average flow at least 0.1 m³/s. It omits smaller channels, many canals and many distributaries. Its single downstream link does not encode all bifurcations. The browser therefore covers the available national network at that threshold, not every watercourse in India.

Source regions are approximate anchors snapped to mapped channels. All 19 selected route starts are within 6 km of their anchors. Every selected route reaches a terminal record in the dataset; this may be the upstream edge of an estuary rather than the open sea. In particular, the Ganga and Brahmaputra mapped routes terminate together in the lower Meghna estuary system. Rivers and elevation are independently generalized, so close views can show alignment artifacts.

The Luni and other seasonal channels are not presented as flowing continuously. Boundaries follow Natural Earth and are contextual rather than an authoritative boundary statement.

## Living Ganga release

The complete Ganga tour now includes eight local 3D miniatures, separate from the atlas terrain. They are optional visits from the map journey, each with camera presets and selectable detours. Varanasi and Haridwar include waterfront architecture, figures, bathing and boats. Malviya Bridge includes road traffic and a railway deck with a passing train. Source, confluence, barrage and estuary scenes complete the journey.

City titles, regional subtitles, projected place labels and a route locator provide orientation. Exploration pauses presentation time while ambient activity continues; explicit pause freezes activity. Continue journey restores guided playback. Seeking reconstructs the selected scene, and only the active and next scene are retained.

The miniatures are original procedural geometry, informed by public destination references. They illustrate places and activity, not surveyed geometry, hydraulic behaviour or contemporary conditions. The feeder channel and local estuary are schematic and do not change the HydroRIVERS topology.

See **ganga-living-journey-guide.md** for controls, scene inventory, references and later work. The map stays central throughout the guided tour. Constant-width gold and blue strokes distinguish followed and onward routes; mint highlights tributary approaches. The Ganga map presentation is approximately 1 minute 52 seconds at 1×; reading and optional visits extend it.

## Next phase: Blender

1. Review the browser's visual direction and journey pacing.
2. Reuse the geographic bounds, terrain height grid and connected river paths. Preserve their coordinates and attribution.
3. Create a terrain mesh and river curves in Blender, separating the background network, selected river, source markers and labels into collections.
4. Reuse the browser's chapter locations, durations, narration and camera direction as a storyboard. Turn each river leg into a camera path, with approach shots and chapter holds. Animate the tracked water marker and tributary reveals at confluences.
5. Add higher-resolution elevation for close shots and verify local source positions before detailed glacier or spring scenes.
6. Add a separate, verified distributary dataset for delta sequences; do not infer splits from the single-link HydroRIVERS graph.
7. Produce an overview sequence, then individual river films. Review geography and label timing before final renders.

Blender work is a later phase; this deliverable implements the browser prototype.

## Sources

- [HydroRIVERS v1 and documentation](https://www.hydrosheds.org/products/hydrorivers). Lehner, B. and Grill, G. (2013), *Hydrological Processes*, 27, 2171–2186. [DOI](https://doi.org/10.1002/hyp.9740).
- [Natural Earth](https://www.naturalearthdata.com/), country geometry and named-river reference.
- [Mapzen / Tilezen elevation tiles](https://registry.opendata.aws/terrain-tiles/), terrain data hosted on AWS.
- [NCERT: Drainage System](https://ncert.nic.in/textbook/pdf/kegy103.pdf), educational river context.
- [National Mission for Clean Ganga: Course of Ganga](https://nmcg.nic.in/courseofganga.aspx), source streams, confluences and the lower-course split.

## Validation of the guided-tour revision

All 19 journeys were checked for downstream-only timeline progress, correct source and outlet endpoints, finite path samples and camera headings, and chapter holds of at least eight seconds. The two highlighted tributary approaches connect to the corresponding main-route confluences. The chapter and camera controls were checked through the browser's structured journey interface. This revision retains the original terrain model.


## Guided reading and adjustable pace

Implemented five playback speeds from 0.5× to 3×, plus 16 Ganga map notes and 14 travel notes. The 32-note destination library is retained alongside miniature descriptions. Reading mode holds the guided timeline and camera while ambient activity continues. Notes support previous/next navigation, source links and return to automatic playback.
