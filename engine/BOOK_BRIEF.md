# بناء كتاب جديد في «مكتبتي الملوّنة» — موجز للمنفّذ

You build ONE Iraqi grade-1 textbook into the interactive kids' library in this repo, end to end,
using the finished «قراءتي الجديدة» (reading) book as your reference implementation. Work only inside
the paths listed under "Your files". Do not edit shared engine files; if you truly need an engine
change, put it in your own extension file (see below) or describe it in your final report.

## Read first
- `engine/README.md`, `engine/build.mjs`, `engine/src/book.js`, `engine/src/games.js`, `engine/src/games2.js`, `engine/src/art.js`.
- Reference pipeline: `engine/tools/build_reading.py` (data generator), `engine/books/reading/source/u*.json` (page transcriptions), `engine/books/reading/lessons.json` (output schema), `/home/claude/books/read/BRIEF.md` (transcription rules), `/home/claude/books/read/VERIFY.md` (second-reader rules), `/home/claude/artjobs/ART_BRIEF.md` (art style).
- Available game templates (data formats are in the template code and in reading's lessons.json):
  listen, trace (shapes in games.js SHAPES), balloons, match, build, choose, train, memory, sort, order, complete, scene, puzzle, read; nashid pages (lesson with no games + `nashid` field).

## Your files (create/modify only these)
- `engine/books/<id>/source/*.json` — transcription of the book pages
- `engine/tools/build_<id>.py` — your generator → writes `engine/books/<id>/lessons.js`, `lessons.json`, `audio-list.csv`, `report.json`
- `engine/src/art/<id>-*.js` — new drawings (export one object of key → () => innerSVG), auto-merged by build.mjs; never redefine an existing key
- `engine/src/ext/<id>.js` — optional new game templates: `export const TEMPLATES = { name: (stage, game, ctx) => ({ destroy, auto }) }`; follow games2.js conventions (no timer, no losing, 3–5 rounds, 2–4 options, after two wrong tries the right answer glows and is spoken, positions reshuffled each round, every touchable item speaks, Pointer Events + `draggable()` for drag, ≥64 px targets, ≥28 px child text, an `auto()` that solves it for tests)
- CSS for new templates: put a `<style>` string in your ext file and inject it once at module load (`document.head.insertAdjacentHTML('beforeend', '<style>…</style>')`).
- `engine/books/shelf.js`: ONLY flip `ready: true` for your book id when it is complete.

## Book data rules (non-negotiable)
- The attached book PDF is the only content source. Every letter, word, number, sentence, question and lesson order comes from it, with its page number. Read pages visually (render with `pdftoppm -r 170`, zoom at 300 dpi); never trust pdftotext for content.
- Copy vowel marks exactly where the book has them; any text a child reads on screen is fully vowelled. Digits in the same form the book uses (١٢٣ or 123) — never mixed within a book.
- Use parallel subagents for transcription, then an independent second-reader pass (like VERIFY.md), then apply the fixes page-aware, exact-match only.
- No invented content. If a game needs extra words/numbers, take them from earlier lessons of the same book and list them in report.json `outside`.
- Do not reproduce poem/song/anthem texts (title, poet, page only).
- Maths: verify every count, sum and difference in code; the number of drawn objects in every counting game must equal the target exactly (add a check in your generator that fails the build otherwise).
- Arabic in all UI/instructions: short (≤ 6 words), fully vowelled, and NEVER these structures/words: ليس…بل، لا…بل، ليست…بل، لم يكن…بل، لم تكن…بل، ما كان…بل، ليس المقصود…وإنما، لا يعني…وإنما؛ التراث، مجرد، بوصفه، بوصفها. Run `python3 engine/tools/lint_ar.py` (it scans all books) — must print clean.
- Art: original hand-coded SVG in the ART_BRIEF style; no internet images, no known characters or brands; humans dressed modestly for Iraq; never draw prophets, companions or angels.

## Build & test (must all pass)
```bash
cd engine && python3 tools/build_<id>.py && python3 tools/lint_ar.py && WA=9647812346562 node build.mjs
node tests/play-all.cjs <id>          # every game solved, star + progress saved, prints "no errors"
node tests/sample-shots.cjs …         # adapt/list your own lessons; look at the screenshots yourself
```
Look at phone (390×844), phone landscape (844×390), tablet (800×1280) and desktop (1366×768) screenshots of every template you use and fix any overlap, cut-off, small target or clashing diacritics.

## Final report (your reply)
Lessons, games, audio clips; merges; inferred/faint items; items taken from earlier lessons; anything you could not do.
