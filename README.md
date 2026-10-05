# India River Atlas

An interactive 3D atlas of India's river network, with 19 featured river journeys and a detailed Ganga tour built from cinematic miniature scenes.

The Ganga journey visits Gaumukh, Devprayag, Haridwar, Prayagraj, Varanasi, Malviya Bridge, Farakka and the lower estuary. It includes animated people, boats and traffic, optional camera detours, five playback speeds, and 46 guide notes for destinations and travel between them.

## Run locally

The browser app is in `dist/`. It uses bundled Three.js and geographic data, so there is no dependency installation or build step.

From the repository root, with Python 3 installed:

```sh
python -m http.server 8765 --bind 127.0.0.1 --directory dist
```

On Windows, `py -3` can be used in place of `python`. Open <http://127.0.0.1:8765/> in a browser with WebGL support. Select Ganga and press **Play journey**. Use **Read at my pace** to hold your place while local activity continues.

## Check a change

With Node.js 20 or later, run:

```sh
node scripts/check.mjs
```

The checks cover module syntax and imports, downstream route continuity and endpoints, all eight miniatures at two detail levels, deterministic animation seeking, stair and bridge placement, resource disposal, and guide-note coverage.

For visual changes, also inspect the affected scene in the browser. Check play/pause, chapter selection, timeline seeking, exploration and return, and a narrow viewport. Automated geometry checks do not replace visual review.

## Where to make changes

| File | Purpose |
| --- | --- |
| `dist/atlas.mjs` | Playback, river selection and journey state |
| `dist/terrain-view.mjs` | National terrain and river map |
| `dist/story-data.mjs` | River chapters and geographic stops |
| `dist/story-engine.mjs` | Route sampling and journey timeline |
| `dist/scene-data.mjs` | Miniature definitions, camera shots and points of interest |
| `dist/local-models.mjs` | 3D geometry and ambient activity |
| `dist/local-scenes.mjs` | Scene transitions, camera detours and resource lifecycle |
| `dist/guide-data.mjs` | Destination and travel notes with factual references |
| `dist/journey-guide.mjs` | Guide controls and reading mode |
| `dist/cinema.css` and `dist/index.html` | Presentation and responsive controls |

For each iteration, make a focused change, run the checks, inspect the affected flow, and commit the result. If a browser retains an older module or stylesheet, update the corresponding version query in its imports or in `dist/index.html`.

## Project notes

- [Journey guide and references](outputs/ganga-living-journey-guide.md)
- [Simulation plan and later Blender work](outputs/river-simulation-plan.md)

Miniatures and activity are stylized educational illustrations. Geographic chapters are approximate at national-map scale; the main Ganga route follows the Padma connection. Local feeder-channel and estuary scenes are schematic. Playback speed measures presentation time, not water speed or real travel time.

## Data and third-party attribution

The app includes HydroRIVERS v1 Asia river sections, Natural Earth geographic context, and sampled Mapzen / Tilezen terrain. The mapped India view contains 255,319 river sections. This is a count of sections, not separately named rivers. Data credits and limitations also appear in **About this map**.

- [HydroRIVERS](https://www.hydrosheds.org/products/hydrorivers) — [included terms](dist/data/hydro-license.pdf) and [technical documentation](dist/data/HydroRIVERS_TechDoc_v10.pdf)
- [Natural Earth](https://www.naturalearthdata.com/)
- [Mapzen / Tilezen terrain](https://registry.opendata.aws/terrain-tiles/)
- [Three.js MIT license](dist/vendor/LICENSE-three.txt)

The original project code has no added redistribution license. Third-party components and datasets retain their own terms.
