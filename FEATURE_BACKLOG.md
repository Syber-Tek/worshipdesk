# WorshipDesk — Next Up

What to build next, and what to leave alone. Delivery status lives in
[`ROADMAP.md`](./ROADMAP.md).

## Build these

Four small, local-only changes. No network, nothing that can break a service.
Media added one optional dependency, `pdfjs-dist`, which is loaded dynamically.

### 1. ✅ Per-item media: image, video, and PDF in the service order
Let a service-order item carry its own image, video, or PDF, so you can show a
slide at a specific point instead of setting one background for the whole app.
The projector already renders this — `outputTheme` has `image` and `video` modes
(PresentationOutputWindow.jsx:64). What's missing is that `outputBgImage` and
`outputBgVideo` are single app-wide `localStorage` values, so the media can't vary
per item.

**Delivered** (branch `feat/media-slides`):
- New **Media Slide** item type in the planner's Add Item dialog, with *Choose
  file(s)* and *Import slide folder*. A folder import appends one playlist item
  per image, in natural order, so `slide10` never plays before `slide2`.
- Picked files are **copied into `userData/media/`** and the item stores only the
  stored filename, so a saved plan is self-contained and survives the original
  file being moved, renamed or deleted.
- Fit control — *Show whole* (`contain`) for images/PDF, *Fill screen* (`cover`)
  for video by default, so a 4:3 sermon slide is letterboxed rather than cropped.
- **Missing-media fallback**: `resolve-media-url` reports whether a stored file
  still exists. A missing file badges the planner item *Missing — Relink* and the
  projector shows a clear "Media File Not Found" panel instead of a black screen.
  Relink stores the replacement first and only then deletes the old file.
- **Video audio**: exactly one projector window may play sound (the lowest open
  display id, passed in as `?audio=1`); the stage display is always silent.
  Default off — congregation sound belongs to vMix.
- **PDF** via `pdfjs-dist`, imported **dynamically** so its ~2 MB stays out of the
  initial bundle and only loads when a PDF is actually shown.
- Fixed the latent bug in **Settings → Presentation**: the custom image/video
  pickers base64-encoded the whole file into `localStorage` (PresentationSettings.jsx:148,
  :267), which hits the ~5 MB quota for anything but a small image. They now go
  through the media store.
- Shared, dependency-free helpers in `src/lib/mediaKinds.js` and
  `src/lib/mediaStore.js`, with self-checks in `test/mediaKinds.test.mjs` and
  `test/mediaStore.test.mjs`. `safeStoredName` is the trust boundary: a stored
  name comes back from the renderer, so separators, traversal and Windows-reserved
  characters are rejected before anything is joined onto the media folder.

**Known limits**:
- A multi-page PDF steps through pages with the existing Next/Prev transport
  controls; the planner shows `Page N of M`. A PDF is never rasterized or split.
- Video loops. There is no transport control (play/pause/seek) — a media slide
  runs to the end of the clip or loops, and the presenter moves on with the deck.
  A single **Replay** control re-triggers the current video from the start.
- No page-through for images either; one file is one slide.

```
# ponytail: .pptx is never parsed. PowerPoint exports PDF, we render PDF.
# If direct .pptx ever becomes mandatory, shell out to soffice if it is on PATH
# and fall back to "export a PDF" when it is not — never bundle LibreOffice.
```


### 2. Countdown timer
`5… 4… 3… 2… 1…` on the projector before the service, plus an optional
service-start clock. A mode alongside the existing `dark` / `light` / `image` /
`video` output modes.

### 3. Auto-advance
Advance hymn stanzas and scripture on a timer so a solo operator isn't pressing a
key every verse. Per-item or per-service interval in **Settings → Presentation**,
with a countdown ring so the congregation sees it coming.
*Hook*: `buildHymnDeck` (src/App.jsx:28) already returns the full ordered stanza
array, so the slide count is known up front.

### 4. Hymn line breaking
Choose how many lyric lines per slide: `1` (teleprompter), `2`, `4`, or the whole
stanza. Today a stanza is all-or-nothing.
*Hook*: `splitHymnStanzas` (src/App.jsx:20).
The single most-requested thing from choirs who read ahead of the screen.

### 5. Lower-third templates
The `Announcement` item type exists but has no layout. Add a few named templates
(speaker name + role, offering, notices) with safe-area positioning.
*Hook*: the existing `attributionPosition` control (PresentationOutputWindow.jsx:136).

## Follow-on

### PowerPoint import
`.pptx` is a ZIP of XML. Text and embedded images can be extracted and turned into
service items; visual design (theme colours, shapes, fonts, animations) cannot.
Worth building only for the text case, and only after item 1 exists — imported
slides are just `Custom Slide` items plus a media background.
Rough shape: unzip, read `ppt/slides/slideN.xml` for `<a:t>` runs, read the slide
rels for images, extract `ppt/media/*`. Needs a zip reader and an XML parser.
Falls out for free once per-item media exists.

## Later — only when a church actually asks

Not scheduled. Listed so the options are known, not so they get built.

| Feature | Why it's waiting |
| --- | --- |
| NDI output | Adds a native module alongside `better-sqlite3`, so it can break the CI rebuild. Until then OBS display capture is fine. |
| Phone / tablet remote | First thing that would listen on a socket, which cuts against the offline promise. A QR web remote off the control window gets most of the benefit for far less. |
| MIDI / Stream Deck | Only helps teams already running a click track. |
| Stacked bilingual layout | Only side-by-side ships. Low value next to items 1–5. |
| Scripture autoflow | Continuous reading, instead of verse-by-verse. |
| Plan templates and reuse | Reuse a service shape with hymns swapped weekly. |
| Plan history in SQLite | Currently 10 recent plans in `localStorage` (src/App.jsx:380). |
| Slide / graphics editor | The biggest gap versus commercial software, and honestly a second application. Its own project. |

## Deliberately not doing

| Idea | Why not |
| --- | --- |
| CCLI SongSelect | Paid licence per church plus copyright reporting. Our hymnals are already licensed content. |
| Cloud sync / accounts | Breaks offline-first for zero benefit to a single machine. |
| Team scheduling / setlist sharing | A different product. Churches that need it already have planning tools. |
| Built-in video editor | OBS and vMix do this better. |
| Camera and live video input | Churches run cameras through vMix/OBS. Feeding a phone camera or capture card in here would duplicate that. EasyWorship can do it as an NDI feed; we don't need to. |
| More than 10 Bible translations | The value is the 5 Twi and 2 Ewe, not the count. |
