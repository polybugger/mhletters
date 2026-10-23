# BRIEF: The Mahatma Letters, Letter No. 1

> **Status: CONFIRMED by the user on 2026-10-23.** Drafted by Claude at the user's request ("draft the answers please"), from the script in `docs/scripts/letter-001/` (`plan.md`, `scene-01.md`), the letter (`docs/letters/letter-001.md`) and its analysis (`docs/analysis/letter-001-analysis.md`). Answers marked **[user]** are the user's own words, quoted verbatim. Answers marked **[drafted]** were authored by Claude. The user approved them: the grammar ("yes that's fine. let's go with that layout."), the peak and signature move ("yes, that's okay."), the asset list ("all good.") and the vibe references ("keep it.").

## Project

An illustrated, scroll-driven telling of Letter No. 1 of *The Mahatma Letters to A. P. Sinnett*, following the script's 11 scenes as 11 chapters.

**This build is Chapter 1 (scene 01, "The Marvels of Simla")** plus the site frame (title page, chapter navigation, the hand-off to Chapter 2). The frame must be designed to extend to all 11 chapters without restructuring.

## User decisions

| Topic | Decision |
|---|---|
| Images | **[user]** "use the anime images. never use the portrait ones." Only `images/anime/`. Never `images/people/` |
| Scope | **[user]** "the first chapter of a site that will grow to all 11 scenes." |
| Video | **[user]** "video is optional, let's not do that." No `scrub`, no clips |
| Missing assets | **[user]** generated in Gemini ("lets go with the cutouts and gemini for generating the missing assets"). Claude writes the prompts and the user renders them. No kie.ai key, no spend |
| Cutouts | **[user]** "yes, okay." Claude makes transparent cutouts of the anime portraits as new files. Originals untouched |
| Interview | **[user]** "draft the answers please." |

## The eight questions

### 1. Vibe, and references **[drafted]**

**Lamplit, hushed, uncanny, Victorian-Himalayan.**

References:
- *The Wind Rises* (Miyazaki, 2013). Period anime played as quiet realism, with weather and light doing the emotional work.
- *The Illustrated London News*, 1880s. Engraved news illustration, captions under pictures, columns of type: the world of Sinnett's own newspaper.
- Kipling, *Plain Tales from the Hills* (1888). Simla society as small, sharp, gossiping and status-conscious.

### 2. The scroll journey, section by section **[drafted, from scene-01.md]**

**Whole site:** a title page, then 11 chapters in the script's order, each a scene. The visitor reads them in order, but can see where they are and jump back.

**Chapter 1:**
1. A title card: "Simla. The summer capital of British India. Early October, 1880."
2. The hillside picnic: pines, the Himalaya, an English party on rugs. One cup short. Blavatsky points at the ground.
3. The dig: earth comes away, the knife strikes china, a matching cup and saucer come up. Wonder, and a skeptic's smile.
4. Dusk by the fire: the cigarette paper, a guest's gasp, Sinnett writing. Patience's voice from the dark.
5. Hume's drawing room: the brooch held to the lamp. Hume, polite and unconvinced: "nothing, yet."
6. Sinnett's study, late at night: his *Pioneer* report beside a mocking reply. He writes the proposal: a London newspaper in Simla on its day of publication.
7. Blavatsky in the doorway: "They do not do tricks for editors." She takes the letter. "They will." The empty doorway, then black, then the way on to Chapter 2.

### 3. The energy curve **[drafted]**

Calm at the open (the title card, the hillside). Rising to the page's only loud moment at the dig. Quiet at the fire. Medium social tension at Hume's. Low, close, intimate tension in the study. A quiet, held close.

### 4. Feeling stage by stage, and the one moment **[drafted]**

The feeling curve is below, with one line per act. **The one moment:** the visitor's own scrolling digs the cup out of the hillside.

### 5. One thing no site they have seen does **[drafted]**

**Scrolling is digging.** At the peak, the visitor's scroll scrapes the earth away, layer by layer, until the knife strikes china and the cup comes up. The visitor finds the phenomenon with their own hand and still doesn't see how it got there.

### 6. How far from premium-minimal **[drafted]**

**Editorial, with a retro accent tied to a specific decade.** Paper grounds, captions, folios and measure from an 1880s illustrated periodical, carrying anime illustration. Not premium-minimal. No dark-and-one-accent palette, and no cream-and-brass.

### 7. One unbroken world, or distinct scenes? **[drafted]**

**Distinct scenes.** Each chapter is its own scene, and inside Chapter 1 there are four distinct locations (hillside, fireside, Hume's house, the study), separated by hard cuts. This matches the script, where every scene is a separate place.

### 8. Assets they already have **[user + drafted]**

- **Have:** 31 anime portraits in `images/anime/`, head and shoulders, with painted backgrounds. Chapter 1 uses Sinnett, Blavatsky, Olcott and Hume.
- **Will make (Claude):** transparent cutouts of the four Chapter 1 characters.
- **Will make (user, in Gemini, from Claude's prompts):** the backgrounds and props Chapter 1 needs (see the asset list below).
- **Won't have:** video, photography, a brand kit. Patience Sinnett and Mrs. Hume have no images and stay off-screen (a voice, a hand), as the script specifies.

## Step 1 answers **[drafted]**

| Question | Answer |
|---|---|
| What is this, and who is it for? | An illustrated, chapter-by-chapter telling of the first Mahatma Letter (Simla, 1880) for readers curious about the letters, Theosophy or Victorian India, who may never have read the original |
| What must the visitor believe by the end of Chapter 1? | That Sinnett had seen something he couldn't explain, and asked for a proof the whole world would have to accept |
| What does the visitor do next? | One action, one label: **"Chapter 2: Unthinkable"**. It's set as running text in the close, not a button |
| What do they already have? | See question 8 |
| Art direction | Illustrated, **anime period drama** (see "World" below) |

## World **[drafted]**

The illustrated world is declared deliberately: the source art is anime, by the user's decision, so this is "a brand whose existing identity is drawn" (worlds.md). It's committed to properly, matched to the existing anime portraits, and not the banned clay or diorama default.

**Style preamble**, reused word for word at the top of every Gemini prompt:

> Anime cartoon style, hand-painted period drama in the manner of a Japanese animated film. India, 1880, the British hill station of Simla in the Himalayan foothills. Soft natural light, clean ink outlines, painted backgrounds with atmospheric depth, muted earthy palette (deodar green, slate, warm lamplight amber, mist blue). Realistic Victorian costume and architecture. No text, no lettering, no watermark.

## Grammar **[drafted]**: Chaptered editorial

The page is a printed feature, and chapters are the unit. It fits because:
- **The content is chapters:** the script has 11 scenes, and the site will grow to 11 chapters.
- **The reading is long-form:** the visitor should feel they read something rather than watched something.
- **It suits the period:** an 1880s periodical is literally chaptered editorial.

What it brings:
- A margin folio (chapter number and title) that updates as chapters pass, and extends naturally to 11.
- A title page hero.
- Hard cuts between chapters.
- A colophon-style close with the next step as a line of running text.

Why the other seven lost:

| Grammar | Why not |
|---|---|
| Filmic one-shot | Forbids visible sequence and jumping. An 11-chapter site needs both |
| Live surface | This isn't a tool or a working product |
| Continuous world | The script is distinct places, not one journey |
| Typographic poster | The illustrations are the content, not decoration on type |
| Gallery / catalog | This is a story, not a range of options. Its museum-label schema would flatten the drama. It's reconsidered for Chapter 6 (the gallery of martyrs) only as a device inside that chapter, not as the site's grammar |
| Split stage | No two-sided comparison runs the whole page |
| Rhythmic cutlist | Wrong energy. The story is slow and lamplit, and it bans `pin` and `parallax`, which the layered scenes need |

**What the grammar constrains:**
- **Hero:** a title page of type on a paper ground, with no media above the fold. Media begins in Chapter 1.
- **Grounds:** each act lands on its own ground. No continuous `drift` gradient, and no full-bleed scrub (there's no video anyway).
- **Text and media:** media sits in its own column with a caption, and never bleeds under type.
- **Banned devices:** `spotlight` and `magnet`.

**Proposed adaptation, to confirm:** the layered hillside and the dig (acts 2–3) are full-width illustration plates, with text in captions beside or below them, never over them. That's how a periodical runs a double-page engraving.

## Feeling curve **[drafted]**

| Act | Feeling | What on screen causes it |
|---|---|---|
| 0 | Anticipation | The title page: "The Mahatma Letters. Letter No. 1." Type on paper, a folio, nothing moving |
| 1 | Curiosity | Hard cut to the hillside plate: mountains, deodars and the picnic party in layers moving at different rates (`parallax`). "One cup short." Blavatsky points |
| 2 | **Wonder (peak)** | The dig, the signature move. Scroll scrapes away the earth layer by layer, the knife strikes china, the cup comes up |
| 3 | Intimacy | Dusk by the fire: one warm plate, Sinnett writing, Patience's line in the margin. The quietest act, giving the peak its after-silence |
| 4 | Doubt | Hume's drawing room: the brooch at the lamp, then Hume and Sinnett's exchange setting line by line (`kinetic` inside a pinned spread) |
| 5 | Resolve | Sinnett's study: his report and the mocking reply side by side, his proposal letter writing itself as you scroll (`reveal`) |
| 6 | Foreboding | Blavatsky in the doorway, "They will.", the empty doorway, and the close: black, then the colophon line "Chapter 2: Unthinkable" |

No two adjacent acts share a feeling. Act 1 (curiosity) is calmer than act 2 (wonder), so the peak has a quiet approach. Act 3 is the silence after it.

## The peak **[drafted]**

> "You scroll and the earth comes away under your hand, and there's a china cup buried in the hillside."

Lives in act 2. It gets the largest scroll span on the page, the best illustrations (the layered dig sequence) and the dwell.

## Tell-someone sentence **[drafted]**

> "It's the site where you dig a teacup out of a Himalayan hillside with your own scrolling, in 1880."

## Authored silence

- The title page (act 0) is meant to be still. It isn't dead scroll.
- The black at the end of act 6, before the colophon line, is a deliberate hold of about half a viewport.

## Signature move **[drafted]**

**The dig.** A stack of painted soil layers (cutouts) over a buried cup and saucer, each layer's position driven by its own threshold of the act's scroll progress (`--sc-p`). They lift away in sequence, with a small knife cutout scraping across between layers. The last layer reveals the china and pauses on "His knife strikes something hard." Bespoke JS in the page, with the engine untouched.

## Fingerprint gate

The registry (`scrollcraft/FINGERPRINTS.md`) is empty, so this is the first build and there's nothing to clear. Its row is appended after it ships.

## Rule exceptions to carry through the build

| Rule | Exception |
|---|---|
| Photographic world by default | Illustrated (anime), by user decision. See "World" |
| No visible em dash | **Exempt for verbatim quotations from the letter** in later chapters, since they must stay word for word. Chapter 1 has no letter quotations. All other copy follows the rule |
| One action and CTA | The only action is continuing to the next chapter, set as running text |
| Invented statistics | None. There are no numbers on the page except the date |

## Chapter 1 asset list **[drafted]**

To confirm, then the Gemini prompts get written. Every prompt uses the preamble above.

| # | Asset | Type | Source |
|---|---|---|---|
| A1 | Simla hillside, back plate: Himalayan snow range and sky, no people | Background | Gemini |
| A2 | Hillside, mid plate: deodar slope with picnic rugs and hampers, no people | Background | Gemini |
| A3 | Hillside, foreground: deodar branches and grass, on a green screen | Foreground | Gemini, then cutout |
| A4 | Soil layers over a buried china cup and saucer (3–4 states: earth, roots, stones, china) | Peak sequence | Gemini, then cutout |
| A5 | The cup and saucer alone, on a plain background | Prop | Gemini, then cutout |
| A6 | Dusk fireside: a fire, rugs, pines in silhouette, no people | Background | Gemini |
| A7 | Hume's drawing room by lamplight, French windows to a dark garden, no people | Background | Gemini |
| A8 | The brooch held up to a lamp: a woman's hand only | Prop | Gemini |
| A9 | Sinnett's study at night: desk, proofs, lamp, misty window, no people | Background | Gemini |
| A10 | The empty doorway at night, with candlelight leaving | Background | Gemini |
| C1–C4 | Sinnett, Blavatsky, Olcott, Hume | Character cutouts | From `images/anime/` |
| — | Picnic guests, servant, officer | Silhouettes | Drawn as shapes in the page, or included in A2 as distant figures |

## Open points for the user

1. **The grammar:** chaptered editorial, with full-width illustration plates as the periodical adaptation. OK?
2. **The peak and signature move:** "scrolling is digging" at the cup. OK?
3. **The asset list:** anything to add or drop before I write the Gemini prompts?
4. **The vibe references:** keep, change, or add your own?
