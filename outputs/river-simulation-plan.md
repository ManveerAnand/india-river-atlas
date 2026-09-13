# India River Atlas — browser prototype and Blender plan

## The learning experience

Begin with an all-India river overview. Rotate the landscape to see the Himalayan arc, plateaus and coastal slopes. Choose a river, identify its headwater region, then follow the connected downstream path. Pause or scrub the journey to inspect important confluences and changes of name.

The central geographic lesson is that India's rivers have many origins. Tributaries normally join downstream; distributaries split, particularly in deltas. Show transboundary sources and outlets because the Indus, Ganga and Brahmaputra systems extend beyond India.

## Browser implementation

- Real elevation rendered as a navigable 3D terrain mesh, with about 44× vertical exaggeration for visibility at national scale.
- HydroRIVERS v1 Asia network: 255,319 mapped reaches intersect the Natural Earth India boundary. Connected basins are retained within 64–99°E and 4–38°N for cross-border context.
- Nineteen selectable journeys: Ganga, Brahmaputra, Indus, Yamuna, Godavari, Krishna, Kaveri, Narmada, Tapi, Mahanadi, Mahi, Sabarmati, Luni, Pennar, Subarnarekha, Brahmani, Periyar, Beas and Sutlej.
- A highlighted river path, downstream particles, a tracked position marker, play/pause, position scrubbing and camera following.
- Source-region labels and selected confluence/place labels. Tributary journeys continue through the receiving river to the mapped outlet.
- Smaller-tributary and terrain toggles, orbit/zoom/pan controls and a narrow-screen layout.

## Accuracy and coverage

This is a geographic flow illustration, not a hydraulic or flood model. Animation speed is illustrative, and journey percentage is based on displayed planimetric route length.

HydroRIVERS represents rivers with catchment area at least 10 km² or average flow at least 0.1 m³/s. It omits smaller channels, many canals and many distributaries. Its single downstream link does not encode all bifurcations. The browser therefore covers the available national network at that threshold, not every watercourse in India.

Source regions are approximate anchors snapped to mapped channels. All 19 selected route starts are within 6 km of their anchors. Every selected route reaches a terminal record in the dataset; this may be the upstream edge of an estuary rather than the open sea. In particular, the Ganga and Brahmaputra mapped routes terminate together in the lower Meghna estuary system. Rivers and elevation are independently generalized, so close views can show alignment artifacts.

The Luni and other seasonal channels are not presented as flowing continuously. Boundaries follow Natural Earth and are contextual rather than an authoritative boundary statement.

## Next phase: Blender

1. Review the browser's visual direction and journey pacing.
2. Reuse the geographic bounds, terrain height grid and connected river paths. Preserve their coordinates and attribution.
3. Create a terrain mesh and river curves in Blender, separating the background network, selected river, source markers and labels into collections.
4. Turn the selected route into a camera path. Animate a tracked water marker and reveal tributaries at confluences.
5. Add higher-resolution elevation for close shots and verify local source positions before detailed glacier or spring scenes.
6. Add a separate, verified distributary dataset for delta sequences; do not infer splits from the single-link HydroRIVERS graph.
7. Produce an overview sequence, then individual river films. Review geography and label timing before final renders.

Blender work is a later phase; this deliverable implements the browser prototype.

## Sources

- [HydroRIVERS v1 and documentation](https://www.hydrosheds.org/products/hydrorivers). Lehner, B. and Grill, G. (2013), *Hydrological Processes*, 27, 2171–2186. [DOI](https://doi.org/10.1002/hyp.9740).
- [Natural Earth](https://www.naturalearthdata.com/), country geometry and named-river reference.
- [Mapzen / Tilezen elevation tiles](https://registry.opendata.aws/terrain-tiles/), terrain data hosted on AWS.
- [NCERT: Drainage System](https://ncert.nic.in/textbook/pdf/kegy103.pdf), educational river context.
