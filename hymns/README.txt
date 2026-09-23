WorshipDesk — Hymns & Songs Folder Structure & Auto-Importer
============================================================

How Song Categories Work:
- Every subfolder inside `hymns/` automatically becomes a category in WorshipDesk.
- The EXACT subfolder name is used as the Category name on the Hymn page.

Current Default Folder Structure:
- hymns/Presby Hymns -Eng/        --> Category: Presby Hymns -Eng
- hymns/Presby Hymns -Twi/        --> Category: Presby Hymns -Twi
- hymns/Presby Liturgy -Eng/      --> Category: Presby Liturgy -Eng
- hymns/Presby Liturgy -Twi/      --> Category: Presby Liturgy -Twi
- hymns/Methodist Hymns -Eng/     --> Category: Methodist Hymns -Eng
- hymns/Methodist Hymns -Twi/     --> Category: Methodist Hymns -Twi
- hymns/Methodist Liturgy -Eng/   --> Category: Methodist Liturgy -Eng
- hymns/Methodist Liturgy -Twi/   --> Category: Methodist Liturgy -Twi

Adding New Song Categories:
1. Create a new subfolder inside `hymns/` with your desired Category name.
   Example: `hymns/Youth Choir Songs/` or `hymns/Praise & Worship/`
2. Drop your .sng or .txt song files inside that subfolder.
3. WorshipDesk will automatically scan the folder and register the new category on startup!

Supported File Formats:
- SongShow Plus / Worship Live files (.sng)
- Text files (.txt)
- JSON Song Collections (.json)
