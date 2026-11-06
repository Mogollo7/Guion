# Cinematic prompt grammar (reference)

This grammar was learned by reading Open Higgsfield AI's Cinema and Video studios
(github.com/Autom8AI/Open-Higgsfield-AI, `src/lib/promptUtils.js` and `presets.js`). The repository declares no
licence, so this is a rewritten summary, not a copy of its code.

## Order of the parts
1. **Subject + action + place**: what we see and what happens. Concrete nouns, one action.
2. **Camera body**: sets texture and dynamic range.
3. **Lens character**.
4. **Perspective** (from the focal length).
5. **Depth of field** (from the aperture).
6. **Camera movement**: one per shot.
7. **Light and mood**.
8. **Style**: photoreal, or a stylised look.
9. **Quality and negatives**: e.g. "ultra-detailed, no text, no logos, no watermark".

## Camera bodies → feel
| Choose | Gives |
|---|---|
| full-frame digital cinema camera | clean, modern, neutral |
| modular 8K digital cinema camera | very sharp, commercial |
| premium large-format digital cinema camera | wide, immersive, shallow focus |
| Super 35 studio digital camera | classic TV and film look |
| grand format 70mm film camera | epic, rich film texture |
| classic 16mm film camera | grain, documentary or nostalgic |

## Lenses → character
- Anamorphic (compact or classic): oval bokeh, horizontal flares, wide cinematic feel.
- Modern / clinical prime: crisp and neutral. Use it for products and UI-adjacent shots.
- Warm cinema prime or 1970s prime: warm, softer contrast.
- Vintage prime, swirl-bokeh portrait, halation diffusion: dreamy, glowing highlights.
- Extreme macro: insects, leaves, water drops, textures.
- Tilt lens: miniature effect for aerial or city shots.

## Focal length → perspective
| mm | Perspective | Typical use |
|---|---|---|
| 8 | ultra-wide | immersive landscapes, cramped interiors |
| 14 | wide-angle | establishing shots |
| 24 | dynamic wide | movement through space |
| 35 | natural cinematic | default storytelling |
| 50 | standard | people at mid distance |
| 85 | classic portrait | faces, isolated subjects |

## Aperture → depth of field
- f/1.4: very shallow, creamy bokeh (subject isolation).
- f/4: balanced.
- f/11: deep focus, everything sharp (landscapes, maps, layouts).

## Camera movements (one per shot)
static (locked-off), dolly-in, dolly-out (reveal), crash zoom, orbit 360, arc, crane up, crane down, tracking
alongside, follow behind, FPV drone, high aerial glide, handheld subtle shake, whip pan, pan left/right, tilt up/down,
rack focus, dutch angle, POV, low-angle hero push-in, top-down rotate, slow zoom-out reveal.

## Stylised looks
hand-painted 2D cel animation, felt stop-motion, claymation, retro 1990s low-poly 3D, modern anime, comic book with
halftones, watercolour, 16-bit pixel art, textured oil painting, toy-brick world, neon cyberpunk, black-and-white film
noir, 1970s vintage film.

## Light and mood words
golden hour, soft diffused light, dramatic studio lighting, volumetric rays, neon glow; serene, epic, warm and cozy,
moody, mysterious.

## Templates
- **Establishing:** `[place at time of day], shot on a premium large-format digital cinema camera, classic anamorphic lens, wide-angle perspective (14 mm), deep focus (f/11), high aerial glide, golden hour, photorealistic, no text`
- **Detail / macro:** `[small subject], extreme macro lens, shallow depth of field (f/1.4), slow rack focus, soft diffused light, photorealistic`
- **Human action:** `[hands/person doing X in place], full-frame digital cinema camera, premium modern prime, natural cinematic perspective (35 mm), shallow depth of field, slow dolly-in, soft morning light, photorealistic, no logos`
- **Transition:** `[texture or motion that matches the next scene's colour], top-down rotate, abstract, no text`
