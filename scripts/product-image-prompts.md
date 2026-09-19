# Product image prompts

How to use:

1. Generate one image per product with an image model (Midjourney, DALL·E / ChatGPT, Adobe Firefly, Gemini, ...).
   Paste the **style suffix** after each product prompt. Use 4:3 landscape (e.g. `--ar 4:3` in Midjourney).
2. Save each result in `public/product-images/` using the filename shown (`.jpg`, `.jpeg`, `.png` or `.webp`).
   Keep them around 1200 px wide and under ~300 KB each.
3. Run `python scripts/generate-product-images.py`. Products that have a photo use it;
   the others keep their SVG illustration.

Tip: generate in one session and reuse the same style suffix so the set looks consistent.
Check results for warped threads, garbled text/logos and impossible geometry, and re-roll those.

## Style suffix (append to every prompt)

> professional e-commerce product photograph, single subject centered, clean light grey seamless studio
> background with a soft natural contact shadow, soft box lighting, sharp focus, realistic industrial
> materials, high detail, 4:3 landscape composition, no text, no logo, no watermark, no people

## Prompts

| File | Prompt |
|---|---|
| `hoses` | A coiled black rubber hydraulic hose, wire-braid reinforced, with crimped steel ferrules and hex fittings on both ends |
| `hose-fittings` | A group of three hydraulic hose end fittings: a straight steel crimp fitting, a 90-degree elbow fitting, and a JIC swivel nut fitting, zinc-plated steel |
| `couplings` | A steel threaded pipe coupling with hex body and two threaded ends, plus a flexible shaft coupling, machined metal |
| `adaptors` | Assorted hydraulic adaptors: a straight male-to-male adaptor, a tee adaptor and a reducing adaptor, zinc-plated steel with visible threads |
| `pressure-gauges-and-test-point-hoses` | A stainless steel liquid-filled pressure gauge with white dial and black needle, next to a coiled black test point hose with a minimess quick connector |
| `ss-expansion-bellow` | A stainless steel corrugated expansion bellow with welded flanges on both ends, polished metal, multiple convolutions |
| `tubes-tube-fittings-and-clamps` | Hydraulic seamless steel tubes with bent sections, a stainless double-ferrule compression tube fitting and black polypropylene twin tube clamps |
| `pneumatics-tube-and-fittings` | A coil of blue polyurethane pneumatic tubing with nickel-plated brass push-in fittings, straight and elbow types |
| `hose-protectors` | A black rubber hydraulic hose covered with a red polyethylene spiral hose guard protector, coiled |
| `oil-and-lubricants` | A 208-litre steel oil drum and a 1-litre plastic lubricant bottle and a grease cartridge, plain unbranded blank labels |
| `hose-clips-and-clamps` | Stainless steel worm-drive hose clamps in two sizes, one open flat and one closed, perforated band, screw housing visible |
| `sae-flange-block` | A square SAE 4-bolt flange block (code 61) with central bore, O-ring groove and four socket head bolts, machined steel, slight oil sheen |
| `quick-release-coupling` | A hydraulic flat-face quick release coupling, male plug and female socket shown disconnected side by side, steel with a sliding sleeve |
| `valves` | A brass ball valve with a red steel lever handle, threaded BSP ends, next to a stainless steel needle valve |
| `belts` | Black rubber V-belts and a ribbed serpentine belt, neatly looped and stacked, with a small V-groove pulley |
| `gi-mms-and-ss-fittings` | Threaded pipe fittings in three materials: galvanised iron elbow, black malleable iron tee, and polished stainless steel socket, all with beaded rims |
| `ss-flexible-hoses-and-braids` | A stainless steel wire-braided flexible hose assembly with stainless steel hex end fittings, gently curved |
| `brass-fittings` | An assortment of brass plumbing fittings: hose barb, compression elbow, hex nipple and a cap nut, polished brass with visible threads |
| `injector-pipes` | A set of three bent steel high-pressure diesel injector pipes with conical nut ends, zinc-coloured finish |
| `composite-hoses-and-hose-assemblies` | A flexible composite chemical transfer hose with helical wire, fitted with stainless steel camlock quick couplings on both ends, coiled |
