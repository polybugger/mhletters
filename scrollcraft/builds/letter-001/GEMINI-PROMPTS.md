# Gemini prompts: Chapter 1 assets

Prompts for the images Chapter 1 needs. Render each in Gemini and save it under the exact file name given, in:

```
images/anime/letter-001/
```

All of these are anime images, so they live under `images/anime/`. Nothing here uses `images/people/`.

## How to use these

1. **Attach a style reference.** In the same Gemini chat, attach `images/anime/helena-blavatsky.jpg` once at the start and say: "Use this image only as a reference for the art style (line work, colouring, shading). Do not include this person." Then paste the prompts one at a time.
2. **Paste the whole prompt.** Each prompt below already starts with the style preamble from `BRIEF.md`, word for word. That's what makes separate images look like one set.
3. **Check every image before saving it.** Regenerate if you see any of these:
   - readable text or letters
   - a watermark
   - extra people where the prompt says "no people"
   - a modern object
   - a background that isn't flat green where the prompt asks for green
4. **Aspect ratio.** Each prompt states its ratio. If Gemini ignores it, add "Aspect ratio 16:9" (or "1:1") on its own line at the end.
5. **Green screen images.** These are the ones marked **green**. The background must be one flat, even, bright green (#00FF00), with no shadows on it and no green on the subject. I key the green out to make transparent cutouts.

## Two changes from the brief's asset list

- **Hillside layers (A1–A3).** Separately generated images never line up exactly. So the middle layer (A2) is painted with its sky area in flat green. I key that out, and the slope then sits cleanly over the mountains (A1) whatever their exact shapes.
- **The dig (A4).** Four "stages" of the same hole wouldn't match from one generation to the next. Instead there's one finished plate of the half-buried cup (A4a), plus separate clumps of earth, roots and stones on green (A4b–A4c). The page piles the clumps over the cup and lifts them away one by one as you scroll. There's also a knife on green (A4d) for the scraping.

## The cup (keep it identical everywhere)

Wherever the cup appears (A4a, A5, A9), the prompt uses this exact description:

> a small white porcelain teacup with a matching saucer, a thin cobalt-blue band around the rim and a small blue floral sprig on the side

---

## A1: Hillside, back plate (sky and mountains)

**Save as:** `a01-hillside-back.png` · **Ratio:** 16:9

```
Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

A wide landscape of the high Himalaya seen from the hills above Simla on a crisp, clear autumn morning. A long range of white snow peaks across the middle of the frame, blue-grey ridges in front of them fading into haze, a pale clear sky with a few thin high clouds. The lower third of the image is only distant hazy blue ridges, no foreground, no trees, no buildings, no people. Calm and vast. Aspect ratio 16:9.
```

## A2: Hillside, middle plate (slope and picnic, green sky)

**Save as:** `a02-hillside-mid.png` · **Ratio:** 16:9 · **Green**

```
Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

A steep grassy hillside clearing among tall deodar cedar trees on a crisp autumn morning, filling the lower half of the frame. In the clearing: Victorian picnic rugs spread on the grass, wicker picnic hampers, a folding wooden chair, a white tablecloth with a teapot and several white teacups. No people at all. The tall deodar trees stand at the left and right edges. Everything above the treetops and the top of the hill, where the sky would be, is a single flat, even, pure bright green (#00FF00) background, with no gradient, no clouds and no shadows. Aspect ratio 16:9.
```

## A3: Hillside, foreground branches

**Save as:** `a03-hillside-front.png` · **Ratio:** 16:9 · **Green**

```
Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

Close foreground framing elements only: dark green deodar cedar branches reaching in from the top left and top right corners, and a strip of long autumn grass and a few ferns along the bottom edge, slightly out of focus as if very close to the camera. The entire rest of the image, including the whole centre, is a single flat, even, pure bright green (#00FF00) background with no shadows. No people, no sky, no landscape. Aspect ratio 16:9.
```

## A4a: The cup in the earth (the peak's final reveal)

**Save as:** `a04a-cup-in-earth.png` · **Ratio:** 16:9

```
Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

A close-up looking down at a patch of freshly scraped dark hillside earth between the roots of a deodar cedar tree. Half buried in the soil, packed with earth, lies a small white porcelain teacup with a matching saucer, a thin cobalt-blue band around the rim and a small blue floral sprig on the side. Crumbs of soil in the cup's rim, fine roots and small stones around it. Morning light falling across it. The china is the brightest thing in the frame. No people, no hands, no tools. Aspect ratio 16:9.
```

## A4b: Clumps of earth (for piling over the cup)

**Save as:** `a04b-earth-clumps.png` · **Ratio:** 16:9 · **Green**

```
Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

Five or six separate clumps of dark, moist hillside earth of different sizes and shapes, each one standing apart from the others with clear space between them, seen from above in soft morning light. Some clumps have a few blades of grass or pine needles on top. Background: a single flat, even, pure bright green (#00FF00) with no shadows. Nothing else in the image. Aspect ratio 16:9.
```

## A4c: Roots and stones (for piling over the cup)

**Save as:** `a04c-roots-stones.png` · **Ratio:** 16:9 · **Green**

```
Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

Several separate pieces laid out with clear space between them, seen from above in soft morning light: three twisted brown tree roots with soil clinging to them, and four or five grey-brown hillside stones of different sizes. Each piece separate and complete. Background: a single flat, even, pure bright green (#00FF00) with no shadows. Nothing else in the image. Aspect ratio 16:9.
```

## A4d: The knife

**Save as:** `a04d-knife.png` · **Ratio:** 16:9 · **Green**

```
Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

A single Victorian table knife from a picnic hamper: a steel blade with a little soil on its tip and a pale bone handle, lying diagonally across the centre of the frame, seen from above. Background: a single flat, even, pure bright green (#00FF00) with no shadows. Nothing else in the image. Aspect ratio 16:9.
```

## A5: The cup and saucer alone

**Save as:** `a05-cup.png` · **Ratio:** 1:1 · **Green**

```
Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

A small white porcelain teacup with a matching saucer, a thin cobalt-blue band around the rim and a small blue floral sprig on the side, the cup resting on its saucer, seen from a slight three-quarter angle above. A few crumbs of dark earth still in the cup's rim and on the saucer. Background: a single flat, even, pure bright green (#00FF00) with no shadows. Nothing else in the image. Aspect ratio 1:1.
```

## A6: Dusk by the fire

**Save as:** `a06-fireside-dusk.png` · **Ratio:** 16:9

```
Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

The same hillside clearing at dusk. A small campfire burns in the centre, throwing warm orange light on Victorian picnic rugs, a wicker hamper and a folding chair around it. Behind, the deodar cedars are dark silhouettes against a deep blue-violet evening sky, with the faint pink last light on distant snow peaks. Sparks rising. No people at all. Warm and intimate, the firelight the only strong light. Aspect ratio 16:9.
```

## A7: Hume's drawing room

**Save as:** `a07-hume-drawing-room.png` · **Ratio:** 16:9

```
Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

A grand Anglo-Indian Victorian drawing room at night after a dinner party. Warm amber oil lamps, heavy dark wood furniture, armchairs, a piano, a marble mantelpiece with a clock and candlesticks, coffee cups on a side table. Tall French windows on one side stand open onto a dark garden. Rich, comfortable, lamplit. No people at all. Aspect ratio 16:9.
```

## A8: The brooch at the lamp

**Save as:** `a08-brooch.png` · **Ratio:** 1:1

```
Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

A close-up of a woman's hand in a lace cuff holding up a small Victorian gold brooch set with pearls toward the warm glow of an oil lamp, the brooch catching the light. Only the hand and wrist are visible, no face. The background is a soft, dark, blurred lamplit room. Aspect ratio 1:1.
```

## A9: Sinnett's study at night

**Save as:** `a09-study-night.png` · **Ratio:** 16:9

```
Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

A narrow, cluttered Victorian study at night, lit by one warm oil lamp on a wooden writing desk. Bookshelves on the walls, framed engravings, a window with cold blue mist pressing against the glass. On the desk: stacks of newspaper proofs, a folded newspaper with blurred illegible columns (no readable words), an inkwell and pen, a blank sheet of writing paper, and a small white porcelain teacup with a matching saucer, a thin cobalt-blue band around the rim and a small blue floral sprig on the side, with dark earth still in its rim. An empty chair pushed back from the desk. No people at all. Aspect ratio 16:9.
```

## A10: The empty doorway

**Save as:** `a10-doorway.png` · **Ratio:** 9:16

```
Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

An open wooden door of a Victorian study seen from inside the dark room at night. Beyond the doorway, a dark corridor, with the last faint warm glow of a candle on the corridor wall as if someone carrying it has just walked away out of sight. The room side is almost black, lit only faintly from a lamp off-frame. No people at all. Quiet and uneasy. Aspect ratio 9:16.
```

## C1: Sinnett, redrawn on green (for his cutout)

**Save as:** `c01-sinnett-green.png` · **Ratio:** 2:3 · **Green**

The automatic cutout of `images/anime/alfred-percy-sinnett.jpg` failed: his dark coat blends into the dark bookshelves and was removed with the background. This redraws him on green so he can be keyed cleanly. It also drops the "ANI-ARTIST" watermark.

**Attach `images/anime/alfred-percy-sinnett.jpg`** with this prompt (not the Blavatsky style reference):

```
Redraw the man in the attached image exactly: the same face, the same bald crown with grey hair at the sides, the same full grey beard and moustache, the same grey eyes and expression, the same dark frock coat and pale cravat, in the same anime cartoon style and colouring. Head and shoulders, facing the same way, framed the same. Replace the whole background with a single flat, even, pure bright green (#00FF00), with no shadows and no gradient. Keep a clear dark outline around the coat so it stands out from the green. No text, no lettering, no watermark, no signature. Aspect ratio 2:3.
```

Check that the face still matches the original before saving. If the face drifts, regenerate.

---

## Checklist

| File | Done |
|---|---|
| `a01-hillside-back.png` | ☐ |
| `a02-hillside-mid.png` (green) | ☐ |
| `a03-hillside-front.png` (green) | ☐ |
| `a04a-cup-in-earth.png` | ☐ |
| `a04b-earth-clumps.png` (green) | ☐ |
| `a04c-roots-stones.png` (green) | ☐ |
| `a04d-knife.png` (green) | ☐ |
| `a05-cup.png` (green) | ☐ |
| `a06-fireside-dusk.png` | ☐ |
| `a07-hume-drawing-room.png` | ☐ |
| `a08-brooch.png` | ☐ |
| `a09-study-night.png` | ☐ |
| `a10-doorway.png` | ☐ |
| `c01-sinnett-green.png` (green) | ☐ |

When they're saved, tell me. I'll check each one, key out the green ones, and build Chapter 1.
