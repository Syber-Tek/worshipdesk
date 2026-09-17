import Database from 'better-sqlite3'
import path from 'node:path'
import fs from 'node:fs'
import { app } from 'electron'
import { CANONICAL_BIBLE } from './bibleBooks.js'

let db = null

/**
 * Initializes the local offline SQLite database in Electron's userData folder.
 */
export function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'church.db')
  db = new Database(dbPath)

  // Enforce WAL mode for fast concurrent disk reads/writes
  db.pragma('journal_mode = WAL')

  // Enable foreign key cascades (delete bible -> removes books & verses)
  db.pragma('foreign_keys = ON')

  // Migration: older installs won't have source_file on bibles yet
  try {
    db.exec('ALTER TABLE bibles ADD COLUMN source_file TEXT')
  } catch {
    // Column already exists — nothing to do
  }

  // Create system_status table
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Create Bible Schema tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS bibles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      language TEXT NOT NULL,
      source_file TEXT
    );

    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bible_id INTEGER NOT NULL,
      book_number INTEGER NOT NULL,
      name TEXT NOT NULL,
      testament TEXT NOT NULL,
      FOREIGN KEY(bible_id) REFERENCES bibles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS verses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      chapter INTEGER NOT NULL,
      verse INTEGER NOT NULL,
      text TEXT NOT NULL,
      FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_verses_lookup ON verses(book_id, chapter, verse);
  `)

  // Create Hymns & Songs Schema tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS hymns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hymn_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      author TEXT,
      lyrics TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_hymns_number ON hymns(hymn_number);
  `)

  // Seed system_status if empty
  const statusCount = db.prepare('SELECT COUNT(*) as count FROM system_status').get()
  if (statusCount.count === 0) {
    db.prepare('INSERT INTO system_status (message) VALUES (?)').run(
      'Offline SQLite Database Initialized Successfully'
    )
  }

  // Seed sample Bible & Hymn data if empty
  seedInitialBibleData()
  seedInitialHymnData()

  // Auto-scan project 'bibles/' and 'hymns/' directories for any dropped files
  autoScanBiblesFolder()
  autoScanHymnsFolder()

  return dbPath
}

export function importSqlFile(filePath) {
  if (!db || !fs.existsSync(filePath)) return { success: false, message: 'File not found' }
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf-8')
    db.exec(sqlContent)
    processImportedTables()
    return { success: true }
  } catch (err) {
    console.error('Failed to execute SQL import:', err)
    return { success: false, error: err.message }
  }
}

const BIBLE_NAMES = {
  NIV: 'New International Version (NIV)',
  NKJV: 'New King James Version (NKJV)',
  KJV: 'King James Version (KJV)',
  TWI: 'Twerɛ Kronkron (Twi Bible - Bible Society of Ghana)'
}

const BOOK_NAME_MAP = {
  Gen: 'Genesis', Exo: 'Exodus', Lev: 'Leviticus', Num: 'Numbers', Deu: 'Deuteronomy',
  Jos: 'Joshua', Jdg: 'Judges', Rut: 'Ruth', '1Sa': '1 Samuel', '2Sa': '2 Samuel',
  '1Ki': '1 Kings', '2Ki': '2 Kings', '1Ch': '1 Chronicles', '2Ch': '2 Chronicles',
  Ezr: 'Ezra', Neh: 'Nehemiah', Est: 'Esther', Job: 'Job', Psa: 'Psalms',
  Pro: 'Proverbs', Ecc: 'Ecclesiastes', Sng: 'Song of Solomon', Isa: 'Isaiah',
  Jer: 'Jeremiah', Lam: 'Lamentations', Ezk: 'Ezekiel', Dan: 'Daniel', Hos: 'Hosea',
  Joe: 'Joel', Amo: 'Amos', Oba: 'Obadiah', Jon: 'Jonah', Mic: 'Micah',
  Nah: 'Nahum', Hab: 'Habakkuk', Zep: 'Zephaniah', Hag: 'Haggai', Zec: 'Zechariah',
  Mal: 'Malachi', Mat: 'Matthew', Mar: 'Mark', Luk: 'Luke', Joh: 'John',
  Act: 'Acts', Rom: 'Romans', '1Co': '1 Corinthians', '2Co': '2 Corinthians',
  Gal: 'Galatians', Eph: 'Ephesians', Php: 'Philippians', Col: 'Colossians',
  '1Th': '1 Thessalonians', '2Th': '2 Thessalonians', '1Ti': '1 Timothy', '2Ti': '2 Timothy',
  Tit: 'Titus', Phm: 'Philemon', Heb: 'Hebrews', Jas: 'James', '1Pe': '1 Peter',
  '2Pe': '2 Peter', '1Jo': '1 John', '2Jo': '2 John', '3Jo': '3 John', Jud: 'Jude', Rev: 'Revelation'
}

function processImportedTables() {
  if (!db) return
  const tableRows = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
  const tableNames = tableRows.map((t) => t.name.toLowerCase())

  for (const table of ['niv', 'nkjv', 'kjv']) {
    if (!tableNames.includes(table)) continue

    const code = table.toUpperCase()

    // Check if Bible already exists in `bibles`
    let bible = db.prepare('SELECT id FROM bibles WHERE code = ?').get(code)
    if (!bible) {
      const name = BIBLE_NAMES[code] || `${code} Bible`
      const res = db.prepare('INSERT INTO bibles (code, name, language, source_file) VALUES (?, ?, ?, ?)').run(
        code,
        name,
        'English',
        'NKJV.sql / NIV.sql / KJV.sql'
      )
      bible = { id: res.lastInsertRowid }
    } else {
      // Check if verses already imported for this bible
      const existingVerse = db.prepare(
        'SELECT v.id FROM verses v JOIN books b ON v.book_id = b.id WHERE b.bible_id = ? LIMIT 1'
      ).get(bible.id)
      if (existingVerse) continue // Already imported
    }

    // Inspect columns of raw table
    const columns = db.prepare(`PRAGMA table_info("${table}")`).all().map(c => c.name.toLowerCase())
    const chCol = columns.includes('chapternumber') ? 'chapternumber' : 'chapter'
    const vCol = columns.includes('versenumber') ? 'versenumber' : 'verse'
    const txtCol = columns.includes('verse') ? 'verse' : 'text'

    // Get distinct books in order
    const rawBooks = db.prepare(`SELECT DISTINCT book FROM "${table}"`).all().map((r) => r.book)

    const insertBook = db.prepare('INSERT INTO books (bible_id, book_number, name, testament) VALUES (?, ?, ?, ?)')
    const insertVerse = db.prepare('INSERT INTO verses (book_id, chapter, verse, text) VALUES (?, ?, ?, ?)')

    const importTxn = db.transaction(() => {
      let bookOrder = 1
      for (const rawBookName of rawBooks) {
        const cleanName = BOOK_NAME_MAP[rawBookName] || rawBookName
        const testament = bookOrder <= 39 ? 'OT' : 'NT'
        const bookRes = insertBook.run(bible.id, bookOrder++, cleanName, testament)
        const bookId = bookRes.lastInsertRowid

        const rows = db.prepare(
          `SELECT "${chCol}" as ch, "${vCol}" as v, "${txtCol}" as txt FROM "${table}" WHERE book = ? ORDER BY verseid ASC`
        ).all(rawBookName)

        for (const row of rows) {
          if (row.txt) {
            insertVerse.run(bookId, row.ch, row.v, row.txt)
          }
        }
      }
    })

    importTxn()
  }
}

// Known bundled XML Bibles — stable codes + display names.
// TWI = Twerɛ Kronkron (Bible Society of Ghana) so Genesis 1:1 etc. import cleanly.
const XML_BIBLE_FILE_DEFS = {
  'TwiKronkronBible.xml': { code: 'TWI', name: 'Twerɛ Kronkron (Asante-Twi Bible — Bible Society of Ghana, 2017)', twi: true },
  'TwiAsanteBible.xml': { code: 'ASNA', name: 'Asante Twi — Nkwa Asɛm (Biblica, 1996/2020)', twi: true },
  'TwiAkuapemBible.xml': { code: 'AKUA', name: 'Akuapem Twi — Nkwa Asɛm (2020)', twi: true },
  'TwiDCBible.xml': { code: 'TWIDC', name: 'Twerɛ Kronkron DC — Asante-Twi with Deutero-Canons (BSG, 2017)', twi: true },
  'TwiRevisedBible.xml': { code: 'TWIRV', name: 'New Revised Asante Twi Bible (2012)', twi: true },
  'EnglishNIVBible.xml': { code: 'NIV', name: 'New International Version (NIV)', twi: false },
  'EnglishNKJBible.xml': { code: 'NKJV', name: 'New King James Version (NKJV)', twi: false },
  'EnglishKJBible.xml': { code: 'KJV', name: 'King James Version (KJV)', twi: false },
}

function decodeXmlEntities(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => { try { return String.fromCodePoint(parseInt(n, 10)) } catch { return '' } })
    .replace(/&amp;/g, '&')
    .trim()
}

export function importXmlBibleFile(filePath) {
  if (!db || !fs.existsSync(filePath)) return { success: false, message: 'File not found' }
  try {
    const rawBuffer = fs.readFileSync(filePath)
    let content = ''
    if ((rawBuffer[0] === 0xFF && rawBuffer[1] === 0xFE) || rawBuffer.includes(0x00)) {
      content = rawBuffer.toString('utf16le')
    } else {
      content = rawBuffer.toString('utf8')
    }
    content = content.replace(/^\uFEFF/, '')

    const fileName = path.basename(filePath, path.extname(filePath))
    const xmlFileDef = XML_BIBLE_FILE_DEFS[path.basename(filePath)]
    const isTwi = xmlFileDef ? xmlFileDef.twi : (fileName.toLowerCase().includes('twi') || content.toLowerCase().includes('twi'))

    const transMatch = content.match(/translation=["']([^"']+)["']/i) || content.match(/biblename=["']([^"']+)["']/i) || content.match(/<title>([^<]+)<\/title>/i)
    const xmlTitle = transMatch ? transMatch[1].trim() : fileName

    const code = xmlFileDef ? xmlFileDef.code : fileName.toUpperCase().replace(/[^A-Z0-9]/g, '_')
    const name = xmlFileDef ? xmlFileDef.name : (isTwi ? `${xmlTitle} (Twi)` : xmlTitle)
    const language = isTwi ? 'Twi' : 'English'

    let bible = db.prepare('SELECT id FROM bibles WHERE code = ?').get(code)
    if (!bible) {
      const res = db.prepare('INSERT INTO bibles (code, name, language, source_file) VALUES (?, ?, ?, ?)').run(code, name, language, path.basename(filePath))
      bible = { id: res.lastInsertRowid }
    } else {
      db.prepare('UPDATE bibles SET name = ?, language = ?, source_file = ? WHERE id = ?').run(name, language, path.basename(filePath), bible.id)
      const existingBooks = db.prepare('SELECT id FROM books WHERE bible_id = ?').all(bible.id)
      if (existingBooks.length > 0) {
        const deleteVerses = db.prepare('DELETE FROM verses WHERE book_id = ?')
        const deleteBook = db.prepare('DELETE FROM books WHERE id = ?')
        db.transaction(() => {
          for (const bk of existingBooks) {
            deleteVerses.run(bk.id)
            deleteBook.run(bk.id)
          }
        })()
      }
    }

    const insertBook = db.prepare('INSERT INTO books (bible_id, book_number, name, testament) VALUES (?, ?, ?, ?)')
    const insertVerse = db.prepare('INSERT INTO verses (book_id, chapter, verse, text) VALUES (?, ?, ?, ?)')

    let bookOrder = 1
    let totalVerses = 0

    const bookRegex = /<(?:BIBLEBOOK|book|div\s+[^>]*type=["']book["'])[\s\S]*?<\/(?:BIBLEBOOK|book|div)>/gi
    const bookMatches = content.match(bookRegex)

    const importTxn = db.transaction(() => {
      if (bookMatches && bookMatches.length > 0) {
        for (const bookXml of bookMatches) {
          let rawBName = ''
          let bNumAttr = 0

          const bNameMatch = bookXml.match(/(?:bname|bsname|name|osisID|id)=["']([^"']+)["']/i)
          if (bNameMatch) rawBName = bNameMatch[1].trim()

          const bNumMatch = bookXml.match(/(?:bnumber|number|n|b)=["']?(\d+)["']?/i)
          if (bNumMatch) bNumAttr = parseInt(bNumMatch[1], 10)

          const bookNum = bNumAttr > 0 ? bNumAttr : bookOrder
          bookOrder = Math.max(bookOrder, bookNum + 1)

          const canonicalEntry = CANONICAL_BIBLE.find(b => b.number === bookNum)
          let cleanName = BOOK_NAME_MAP[rawBName] || rawBName
          if (!cleanName && canonicalEntry) {
            cleanName = isTwi ? canonicalEntry.tw : canonicalEntry.en
          }
          if (!cleanName) cleanName = `Book ${bookNum}`

          const testament = bookNum <= 39 ? 'OT' : 'NT'

          const bookRes = insertBook.run(bible.id, bookNum, cleanName, testament)
          const bookId = bookRes.lastInsertRowid

          const chapterRegex = /<(?:CHAPTER|chapter|c)[\s\S]*?<\/(?:CHAPTER|chapter|c)>/gi
          const chapterMatches = bookXml.match(chapterRegex)

          if (chapterMatches && chapterMatches.length > 0) {
            for (const chXml of chapterMatches) {
              let chNum = 1
              const chNumMatch = chXml.match(/(?:cnumber|number|n|c|id)=["']?(\d+)["']?/i)
              if (chNumMatch) chNum = parseInt(chNumMatch[1], 10)

              const verseRegex = /<(?:VERS|verse|v)[^>]*?(?:vnumber|number|n|id)=["']?(\d+)["']?[^>]*>([\s\S]*?)<\/(?:VERS|verse|v)>/gi
              let vMatch
              while ((vMatch = verseRegex.exec(chXml)) !== null) {
                const vNum = parseInt(vMatch[1], 10)
                let vText = decodeXmlEntities(vMatch[2].replace(/<[^>]+>/g, ''))
                if (vText) {
                  insertVerse.run(bookId, chNum, vNum, vText)
                  totalVerses++
                }
              }
            }
          } else {
            const verseRegex = /<(?:VERS|verse|v)[^>]*?(?:vnumber|number|n|id)=["']?(\d+)["']?[^>]*>([\s\S]*?)<\/(?:VERS|verse|v)>/gi
            let vMatch
            while ((vMatch = verseRegex.exec(bookXml)) !== null) {
              const vNum = parseInt(vMatch[1], 10)
              let vText = decodeXmlEntities(vMatch[2].replace(/<[^>]+>/g, ''))
              if (vText) {
                insertVerse.run(bookId, 1, vNum, vText)
                totalVerses++
              }
            }
          }
        }
      }
      return totalVerses
    })

    const count = importTxn()
    return { success: true, count, code }
  } catch (err) {
    console.error('Failed to import XML Bible file:', err)
    return { success: false, error: err.message }
  }
}

export function autoScanBiblesFolder() {
  try {
    const biblesDir = path.join(process.cwd(), 'bibles')
    if (!fs.existsSync(biblesDir)) {
      fs.mkdirSync(biblesDir, { recursive: true })
    }

    // Ensure bibles/xml exists with an empty marker so users know where to drop files
    const xmlDir = path.join(biblesDir, 'xml')
    if (!fs.existsSync(xmlDir)) {
      fs.mkdirSync(xmlDir, { recursive: true })
      const readmeText = `Church Presenter — Bible Data Importer Folder
==============================================
Place your Bible files in these folders to import them on the next app start:

1. SQL Files (.sql):
   - Drop NKJV.sql, NIV.sql, or KJV.sql files directly into "bibles/".

2. XML Files (.xml):
   - Drop structured Bible XML files (Zefania/OSIS/USFX or
     "<book number>...<chapter number>...<verse number>") into "bibles/xml/".
   - Bundled NIV / NKJV / KJV (English) and Twerɛ Kronkron (Twi) XML Bibles
     already live here and ship with the app.

3. Songs (.sng):
   - Drop "PH01.sng" style files into "bibles/".
`
      fs.writeFileSync(path.join(xmlDir, 'README.txt'), readmeText, 'utf-8')
    }

    // Auto-import any .sql files in bibles/
    const sqlFiles = fs.readdirSync(biblesDir).filter((f) => f.endsWith('.sql'))
    for (const file of sqlFiles) {
      importSqlFile(path.join(biblesDir, file))
    }

    // Process imported tables into normalized schema
    processImportedTables()

    // Auto-import XML files in bibles/ or bibles/xml/
    if (fs.existsSync(xmlDir) && fs.statSync(xmlDir).isDirectory()) {
      const xmlFiles = fs.readdirSync(xmlDir).filter((f) => f.endsWith('.xml'))
      for (const file of xmlFiles) {
        importXmlBibleFile(path.join(xmlDir, file))
      }
    }
    const rootXmlFiles = fs.readdirSync(biblesDir).filter((f) => f.endsWith('.xml'))
    for (const file of rootXmlFiles) {
      importXmlBibleFile(path.join(biblesDir, file))
    }
  } catch (err) {
    console.warn('Auto scan bibles folder notice:', err.message)
  }
}

export function importSngFile(filePath) {
  if (!db || !fs.existsSync(filePath)) return { success: false, message: 'File not found' }
  try {
    const rawBuffer = fs.readFileSync(filePath)
    let content = ''
    if ((rawBuffer[0] === 0xFF && rawBuffer[1] === 0xFE) || rawBuffer.includes(0x00)) {
      content = rawBuffer.toString('utf16le')
    } else {
      content = rawBuffer.toString('utf8')
    }
    content = content.replace(/^\uFEFF/, '')

    const fileName = path.basename(filePath, path.extname(filePath))
    let title = fileName
    let hymnNumber = 0
    let author = 'Presbyterian Church of Ghana'
    let category = 'Presby Hymnal'

    const numMatch = fileName.match(/^(?:PH\s*)?(\d+)/i)
    if (numMatch) {
      hymnNumber = parseInt(numMatch[1], 10)
    }

    const lines = content.split(/\r?\n/)
    const lyricLines = []

    for (let rawLine of lines) {
      const line = rawLine.trim()
      if (!line) {
        lyricLines.push('')
        continue
      }

      const titleMatch = line.match(/^#?Title\s*[:=]\s*(.+)$/i)
      if (titleMatch) {
        title = titleMatch[1].trim()
        continue
      }
      const authorMatch = line.match(/^#?Author\s*[:=]\s*(.+)$/i)
      if (authorMatch) {
        author = authorMatch[1].trim()
        continue
      }
      const numberMatch = line.match(/^#?(?:Number|HymnNumber|No)\s*[:=]\s*(\d+)$/i)
      if (numberMatch) {
        hymnNumber = parseInt(numberMatch[1], 10)
        continue
      }
      const catMatch = line.match(/^#?Category\s*[:=]\s*(.+)$/i)
      if (catMatch) {
        category = catMatch[1].trim()
        continue
      }

      if (line.startsWith('#') && line.includes('=')) continue

      lyricLines.push(line)
    }

    let lyrics = lyricLines.join('\n').trim()
    if (!lyrics) lyrics = content.trim()

    title = title.replace(/^[0-9\s_\-]+/, '').replace(/\.sng$/i, '').trim() || fileName

    const insert = db.prepare('INSERT INTO hymns (hymn_number, title, category, author, lyrics) VALUES (?, ?, ?, ?, ?)')
    insert.run(hymnNumber, title, category, author, lyrics)

    return { success: true, title, hymnNumber }
  } catch (err) {
    console.error('Failed to import .sng file:', err)
    return { success: false, error: err.message }
  }
}

export function importSngFolder(folderPath) {
  if (!db || !fs.existsSync(folderPath)) return { success: false, message: 'Folder not found' }
  try {
    const files = fs.readdirSync(folderPath).filter((f) => f.endsWith('.sng') || f.endsWith('.txt'))
    let count = 0
    for (const file of files) {
      const res = importSngFile(path.join(folderPath, file))
      if (res.success) count++
    }
    return { success: true, count }
  } catch (err) {
    console.error('Failed to import .sng folder:', err)
    return { success: false, error: err.message }
  }
}

export function autoScanHymnsFolder() {
  try {
    const hymnsDir = path.join(process.cwd(), 'hymns')
    if (!fs.existsSync(hymnsDir)) {
      fs.mkdirSync(hymnsDir, { recursive: true })
      return
    }

    importSngFolder(hymnsDir)

    const subdirs = fs.readdirSync(hymnsDir).filter(f => fs.statSync(path.join(hymnsDir, f)).isDirectory())
    for (const sub of subdirs) {
      importSngFolder(path.join(hymnsDir, sub))
    }
  } catch (err) {
    console.warn('Auto scan hymns folder notice:', err.message)
  }
}

function seedInitialBibleData() {
  const bibleCount = db.prepare('SELECT COUNT(*) as count FROM bibles').get()
  if (bibleCount.count > 0) return

  const insertBible = db.prepare('INSERT INTO bibles (code, name, language) VALUES (?, ?, ?)')
  const kjvResult = insertBible.run('KJV', 'King James Version', 'English')
  const kjvId = kjvResult.lastInsertRowid

  const insertBook = db.prepare('INSERT INTO books (bible_id, book_number, name, testament) VALUES (?, ?, ?, ?)')
  const genResult = insertBook.run(kjvId, 1, 'Genesis', 'OT')
  const pslResult = insertBook.run(kjvId, 19, 'Psalms', 'OT')
  const jhnResult = insertBook.run(kjvId, 43, 'John', 'NT')

  const genId = genResult.lastInsertRowid
  const pslId = pslResult.lastInsertRowid
  const jhnId = jhnResult.lastInsertRowid

  const insertVerse = db.prepare('INSERT INTO verses (book_id, chapter, verse, text) VALUES (?, ?, ?, ?)')
  
  insertVerse.run(genId, 1, 1, 'In the beginning God created the heaven and the earth.')
  insertVerse.run(genId, 1, 2, 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.')
  insertVerse.run(genId, 1, 3, 'And God said, Let there be light: and there was light.')

  insertVerse.run(pslId, 23, 1, 'The LORD is my shepherd; I shall not want.')
  insertVerse.run(pslId, 23, 2, 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.')
  insertVerse.run(pslId, 23, 3, 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.')

  insertVerse.run(jhnId, 3, 16, 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.')
  insertVerse.run(jhnId, 3, 17, 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.')
}

function seedInitialHymnData() {
  const hymnCount = db.prepare('SELECT COUNT(*) as count FROM hymns').get()
  if (hymnCount.count > 0) return

  const insertHymn = db.prepare('INSERT INTO hymns (hymn_number, title, category, author, lyrics) VALUES (?, ?, ?, ?, ?)')

  insertHymn.run(
    1,
    'Amazing Grace',
    'General Hymn',
    'John Newton',
    'Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.\n\n\'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed!'
  )

  insertHymn.run(
    12,
    'Great Is Thy Faithfulness',
    'Worship',
    'Thomas Chisholm',
    'Great is Thy faithfulness, O God my Father,\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions, they fail not;\nAs Thou hast been Thou forever wilt be.\n\nGreat is Thy faithfulness!\nGreat is Thy faithfulness!\nMorning by morning new mercies I see.'
  )

  insertHymn.run(
    100,
    'Aseda Nka Nyankopɔn (Thanks Be to God)',
    'Ghanaian Worship / Twi',
    'Traditional Church Song',
    'Aseda nka Nyankopɔn wɔ sorosoro;\nNe dɔ ne ne adom dooso ma yɛn.\nMo hyira Ne din krɔnkrɔn no daa,\nƆye, Ne m mobɔhye tim hɔ daa.'
  )
}

export function getStatusMessage() {
  if (!db) return null
  return db.prepare('SELECT * FROM system_status ORDER BY id DESC LIMIT 1').get()
}

export function getBibles() {
  if (!db) return []
  return db.prepare('SELECT * FROM bibles ORDER BY id ASC').all()
}

export function getBibleStats() {
  if (!db) return []
  const bibles = getBibles()
  const stats = bibles.map((bible) => {
    const bookCount = db.prepare('SELECT COUNT(*) as count FROM books WHERE bible_id = ?').get(bible.id).count
    const verseCount = db.prepare('SELECT COUNT(*) as count FROM verses v JOIN books b ON v.book_id = b.id WHERE b.bible_id = ?').get(bible.id).count
    const sourceFile = db.prepare('SELECT source_file FROM bibles WHERE id = ?').get(bible.id)?.source_file || null
    return { ...bible, bookCount, verseCount, sourceFile }
  })
  return stats
}

export function removeBible(bibleId) {
  if (!db) return { success: false, error: 'DB not ready' }
  const bible = db.prepare('SELECT id, code FROM bibles WHERE id = ?').get(bibleId)
  if (!bible) return { success: false, error: 'Bible not found' }
  if (bible.code.toUpperCase() === 'NIV' || bible.code.toUpperCase() === 'NKJV' || bible.code.toUpperCase() === 'KJV' || bible.code.toUpperCase() === 'TWI') {
    return { success: false, error: 'This is a default bundled Bible and cannot be deleted' }
  }
  try {
    db.transaction(() => {
      db.prepare('DELETE FROM books WHERE bible_id = ?').run(bible.id)
      db.prepare('DELETE FROM bibles WHERE id = ?').run(bible.id)
    })()
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export function rescanBiblesFolder() {
  try {
    autoScanBiblesFolder()
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export function getBooks(bibleId = 1) {
  if (!db) return []
  const books = db.prepare('SELECT * FROM books WHERE bible_id = ? ORDER BY book_number ASC').all(bibleId)
  return books.map((b) => {
    const chRes = db.prepare('SELECT MAX(chapter) as maxCh FROM verses WHERE book_id = ?').get(b.id)
    return {
      ...b,
      chaptersCount: chRes && chRes.maxCh ? chRes.maxCh : 1
    }
  })
}

export function getVerses(bookId, chapter) {
  if (!db) return []
  return db.prepare('SELECT * FROM verses WHERE book_id = ? AND chapter = ? ORDER BY verse ASC').all(bookId, chapter)
}

export function searchVerses(query, bibleId) {
  if (!db || !query) return []
  const pattern = `%${query}%`
  return db.prepare(`
    SELECT v.*, b.name as book_name
    FROM verses v
    JOIN books b ON v.book_id = b.id
    WHERE v.text LIKE ?
      AND (? IS NULL OR b.bible_id = ?)
    ORDER BY b.bible_id ASC, b.book_number ASC, v.chapter ASC, v.verse ASC
    LIMIT 30
  `).all(pattern, bibleId || null, bibleId || null)
}

export function getHymns() {
  if (!db) return []
  return db.prepare('SELECT * FROM hymns ORDER BY hymn_number ASC').all()
}

export function searchHymns(query) {
  if (!db || !query) return getHymns()
  const pattern = `%${query}%`
  const isNumber = !isNaN(query)
  if (isNumber) {
    return db.prepare('SELECT * FROM hymns WHERE hymn_number = ? OR title LIKE ? OR lyrics LIKE ?').all(parseInt(query), pattern, pattern)
  }
  return db.prepare('SELECT * FROM hymns WHERE title LIKE ? OR lyrics LIKE ? ORDER BY hymn_number ASC').all(pattern, pattern)
}

export function addHymn({ number, title, category, author, lyrics }) {
  if (!db) return null
  const insert = db.prepare('INSERT INTO hymns (hymn_number, title, category, author, lyrics) VALUES (?, ?, ?, ?, ?)')
  const result = insert.run(
    number || 0,
    title,
    category || 'Custom Song',
    author || 'Unknown',
    lyrics
  )
  return result.lastInsertRowid
}

export function importHymnsBatch(hymnList) {
  if (!db || !Array.isArray(hymnList)) return 0
  const insert = db.prepare('INSERT INTO hymns (hymn_number, title, category, author, lyrics) VALUES (?, ?, ?, ?, ?)')
  const insertMany = db.transaction((items) => {
    let count = 0
    for (const h of items) {
      if (h.title && h.lyrics) {
        insert.run(
          h.number || h.hymn_number || 0,
          h.title,
          h.category || 'Imported Song',
          h.author || '',
          h.lyrics
        )
        count++
      }
    }
    return count
  })
  return insertMany(hymnList)
}
