---
name: letter-analysis
description: Write a structured historical and textual analysis of a letter from The Mahatma Letters (or any historical letter). Use when the user asks to analyze, explain, annotate or write a report on a letter, e.g. "analyze letter 12", "do the analysis for letter 3b", "who is mentioned in letter 40 and when was it written". Covers audience, topics, concepts, issues, people, timeline/setting, a fact check of the letter's own claims, and critical issues, keeping what the text says apart from outside context.
---

# Letter analysis

Produce an analysis report for one letter. The report explains what the letter says, who is in it, when and where it was written, what a reader needs to know to follow it, and where it is wrong, contested or unclear.

The core discipline: **always separate what the letter itself says from what you bring in from outside.** Readers use these reports to study the text, so a claim that sounds like it comes from the letter but actually comes from your background knowledge is a defect.

## Inputs

- **Letter text.** Use the text the user provides or points to. Note any editorial material that comes with it: the letter number, book section, the editor's "Received …" note, footnotes, and chronological reading links.
- If the user gives an excerpt and the full letter is available, read the whole letter. Analyze the excerpt, but use the whole letter for context, and say in the report which part the excerpt covers.
- If only an excerpt is available, say so in the report and don't guess at the missing parts.

Read the entire text, including footnotes and the received-note, before writing anything.

## Output

Save the report where the user asks. If they don't say, ask before writing a file. If an analysis for the letter already exists, read it and update it in place rather than starting over; keep anything the user added.

Open with a title and a date/author line:

```markdown
# Mahatma Letters No. <id> — Analysis

<Mon D, YYYY> · @<user>
```

## Marking sources

Use these tags wherever the source of a claim isn't obvious:

- **(text)** — stated in the letter. Back important points with a short quotation in quote marks.
- **(editor)** — from Barker's received-note, headings or footnotes.
- **(context)** — historical knowledge from outside the letter.
- **(inferred)** — your reading of an allusion, e.g. "the devoted woman" → Blavatsky. Say what the inference rests on.

When unsure of a fact (a date, an identification, a biographical detail), say so plainly rather than stating it with false confidence. Don't invent page numbers, quotations or citations.

## Report sections

Use these sections in this order. Leave a section out only if it truly has nothing in it, and say so in one line instead of padding it.

### 1. Summary
Two to four sentences: who writes to whom, why, and the letter's main move (e.g. refuses a request, answers questions, rebukes, gives instructions).

### 2. Source and setting of the text
- Letter id, book section, and the received-note (place and date) **(editor)**.
- Whether the analysis covers the whole letter or an excerpt, and where the excerpt sits.
- Chronological position: which letters come before and after it in reading order, if known, and anything known about the letter it answers.
- Physical or transmission notes if given (handwriting, copy, "transcribed from…", deleted lines).

### 3. Intended audience
Direct recipient, people the writer clearly expects to see or hear of it, and the wider audience. Note who "you" and "we" refer to, and when that shifts.

### 4. What prompted it
The request, event or earlier letter it responds to. Mark what the letter itself reveals about this **(text)** separately from the background **(context)**.

### 5. Main topics and argument
Numbered list following the order of the argument, so a reader can see how it moves from point to point. One or two lines each, with a key quotation where it helps.

### 6. Concepts needed to understand it
Table: `Concept | What it means here`. Include technical Theosophical or Sanskrit terms, literary and scientific allusions (e.g. *vril* → Bulwer-Lytton's *The Coming Race*), and period ideas the modern reader may lack. Explain the meaning **in this letter**, not just a dictionary definition.

### 7. Issues raised in the letter
The problems, risks, dilemmas or disagreements the writer names. This is the letter's own agenda, not your critique.

### 8. People and actors
Split into three tables. Columns: `Name or reference | Who they are | Role in this letter | Source`.

1. **Named or alluded to in the text** — correspondents, people named ("Mr. Hume", "Sir Donald Stewart") and people alluded to ("the devoted woman"). For allusions, give the identification and mark it **(inferred)**.
2. **Historical, scientific, literary and mythological figures referenced** — people the writer uses as examples (Bacon, Galileo, Socrates) and mythic or allegorical figures (Saraswati, Solomon and the Jin). Say what point each is used to make.
3. **Background people not in the text** — people relevant to the situation but not mentioned (e.g. Olcott, Morya). Mark all as **(context)**. Keep this table short.

Groups ("the ignorant masses", "the higher and educated classes", "the skeptics") go in table 1 when the letter treats them as actors.

### 9. Timeline, era and setting
- **Date:** the received-note date, and how certain it is ("about", braces `{}` mean editorial dating).
- **Place:** where it was received, and where it claims to be written from if stated.
- **Timeline table:** `Date | Event`, a short run of events placing the letter (what came before, what it led to). Mark events in or implied by the letter separately from context.
- **Era:** the political, intellectual and religious currents the letter engages with, each tied to a specific passage.
- **Setting:** the social world of the place (e.g. Simla's season), only as far as it helps read the letter.

### 10. Fact check of the letter's own claims
The letters make many historical and scientific claims. List the checkable ones and give a verdict: `Claim (quote) | Verdict | Note`. Verdicts: *accurate*, *inaccurate*, *disputed*, *unverifiable*. Example: the letter dates the Royal Society to 1662 and links it to Bacon — the charter date is right, but Bacon died in 1626 and wasn't a founder. Don't fact-check the occult claims themselves; mark those *unverifiable* only if listing them is useful.

### 11. Critical issues with the letter
Authorship and authenticity questions (the Hodgson Report, later reviews), weaknesses in the reasoning (e.g. unfalsifiable arguments), attitudes of the period (class, race, gender), and predictions that later came true or failed. Present contested points as contested, giving the main positions rather than a verdict.

### 12. Open questions
Short list of what remains unclear — unidentified people, obscure allusions, uncertain dates, editorial gaps (e.g. "seven lines deleted — Ed.").

## Style

- Write for a reader studying the text: clear, plain, no filler. Short paragraphs, lists and tables.
- Quote the letter exactly, including its spelling (*Akás*, *Koot' Hoomi*), and use the edition's punctuation.
- Use neutral language about the Masters and phenomena: "the letter claims", "attributed to K.H.", not endorsement or mockery.
- Use they/them for anyone whose pronouns aren't established by the historical record.
- Keep each section proportionate to the letter. A three-line note doesn't need a twelve-row people table.

## Several letters

When asked to analyze a batch or a series:

- Write one file per letter as above.
- Keep identifications consistent across files. For more than a few letters, keep a shared list of people (`Name | Also called | Who they are | Letters`) alongside the reports, and reuse and extend it rather than re-identifying people each time.
- In section 2, link related analyses (the letter this one answers, the next in chronological order) with relative links.

## Before finishing

Check that:
- every section is present or explicitly marked as empty,
- each quotation matches the letter file word for word,
- people and events from outside the text are tagged **(context)** or **(inferred)**,
- uncertain dates and identifications are flagged as uncertain.

Then tell the user where the file is and mention any open questions worth their attention.
