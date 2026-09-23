WorshipDesk — Bible Data Importer & Folder Structure
=====================================================

WorshipDesk automatically scans this `bibles/` directory on app startup to import and register offline Bible translations into SQLite.

Supported Formats & Folder Structure:

1. XML Bibles (.xml):
   - Place XML Bible translation files directly in `bibles/xml/` (or `bibles/`).
   - Supported Formats:
     * Zefania XML (<XMLBIBLE>, <BIBLEBOOK>, <CHAPTER>, <VERS>)
     * OSIS XML (<osisText>, <div type="book">, <chapter>, <verse>)
     * USFX XML (<usfx>, <book>, <c>, <v>)
     * Generic XML (<bible>, <book>, <chapter>, <verse>)
   - Examples: `twi.xml`, `akua_twi.xml`, `niv.xml`, `kjv.xml`

2. SQL Database Files (.sql):
   - Drop pre-packaged SQLite/SQL Bible dumps directly inside `bibles/`.
   - Examples: `KJV.sql`, `NIV.sql`, `NKJV.sql`, `EWE.sql`

3. Plain Text Book Files (.txt):
   - Create a subfolder with the Bible name (e.g., `bibles/Twi/`).
   - Place the 66 Bible book text files inside (e.g., `Genesis.txt`, `John.txt`).
   - Line Format: "1:1 In the beginning..." or "1 In the beginning..."

Managing Bibles:
- All imported Bibles appear under Settings -> Bible Library.
- You can rescan folders or remove installed translations anytime from the app UI.
