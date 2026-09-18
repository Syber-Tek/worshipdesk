import React, { useState, useEffect } from 'react'
import {
  Voice2,
  Search,
  Show,
  Send,
  Plus,
  Category,
  Document
} from 'react-iconly'

export default function SongsView({
  handleStageNext,
  handlePresentNow,
  handleAddToPlaylist,
  themeMode,
  defaultHymnCategory = 'All',
  showHymnNumbers = true,
  hymnTextScale = 'normal'
}) {
  const isLight = themeMode === 'light'
  const [hymnsList, setHymnsList] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(defaultHymnCategory || 'All')
  const [selectedHymn, setSelectedHymn] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lyricsCache, setLyricsCache] = useState({})

  useEffect(() => {
    if (defaultHymnCategory) {
      setSelectedCategory(defaultHymnCategory)
    }
  }, [defaultHymnCategory])

  const cardClass = isLight
    ? 'bg-[#FFFFFF] border-[#E5E7EB] text-[#111827] shadow-sm'
    : 'bg-[#151619] border-[#26282E] text-[#EDEDEE]'

  const innerCardClass = isLight
    ? 'bg-[#F9FAFB] border-[#E5E7EB]'
    : 'bg-[#1B1C20] border-[#26282E]'

  const labelClass = isLight ? 'text-[#6B7280]' : 'text-[#9CA0AC]'
  const headingClass = isLight ? 'text-[#111827]' : 'text-[#EDEDEE]'

  const categories = [
    'All',
    'Presby Hymns (Twi)',
    'Presby Hymns (Eng)',
    'Methodist Hymns (Twi)',
    'Methodist Hymns (Eng)',
    'Presby Liturgy',
    'Methodist Liturgy'
  ]

  const hymnLabel = (hymn) => {
    if (!showHymnNumbers) return 'Hymn'
    return hymn.hymn_number > 0
      ? `${String(hymn.category || '').includes('Methodist') ? 'MH' : 'PH'} ${hymn.hymn_number}`
      : 'Hymn'
  }

  useEffect(() => {
    fetchHymns(searchQuery, selectedCategory)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory])

  // Loads full lyrics for the selected hymn once (cached per hymn id).
  const loadLyrics = async (hymn) => {
    if (!hymn || lyricsCache[hymn.id]) return
    if (window.api && window.api.getHymnLyrics) {
      try {
        const full = await window.api.getHymnLyrics(hymn.id)
        if (full && full.lyrics) {
          setLyricsCache((prev) => ({ ...prev, [hymn.id]: full.lyrics }))
        }
      } catch (err) {
        console.error('Failed to load hymn lyrics:', err)
      }
    }
  }

  const handleSelectHymn = (hymn) => {
    setSelectedHymn(hymn)
    loadLyrics(hymn)
  }

  const fetchHymns = async (query, cat) => {
    setIsLoading(true)
    try {
      if (window.api && window.api.listHymns) {
        const results = await window.api.listHymns(query, cat === 'All' ? null : cat)
        if (Array.isArray(results)) {
          setHymnsList(results)
          const keep = selectedHymn && results.some((h) => h.id === selectedHymn.id)
          if (keep) {
            loadLyrics(selectedHymn)
          } else {
            const next = results[0] || null
            setSelectedHymn(next)
            if (next) loadLyrics(next)
          }
        }
      } else {
        // Fallback sample offline hymns if IPC not bound
        const sampleHymns = [
          {
            id: 1,
            hymn_number: 1,
            title: 'Amazing Grace',
            category: 'Presby Hymns (Eng)',
            author: 'John Newton',
            lyrics: 'Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.\n\n\'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed!'
          },
          {
            id: 12,
            hymn_number: 12,
            title: 'Great Is Thy Faithfulness',
            category: 'Presby Hymns (Eng)',
            author: 'Thomas Chisholm',
            lyrics: 'Great is Thy faithfulness, O God my Father,\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions, they fail not;\nAs Thou hast been Thou forever wilt be.\n\nGreat is Thy faithfulness!\nGreat is Thy faithfulness!\nMorning by morning new mercies I see.'
          },
          {
            id: 100,
            hymn_number: 100,
            title: 'Aseda Nka Nyankopɔn (Thanks Be to God)',
            category: 'Presby Hymns (Twi)',
            author: 'Presbyterian Church of Ghana',
            lyrics: 'Aseda nka Nyankopɔn wɔ sorosoro;\nNe dɔ ne ne adom dooso ma yɛn.\nMo hyira Ne din krɔnkrɔn no daa,\nƆye, Ne mobɔhye tim hɔ daa.'
          }
        ]
        const filtered = sampleHymns.filter(h => {
          const matchQ = !query || String(h.hymn_number).includes(query) || h.title.toLowerCase().includes(query.toLowerCase()) || h.lyrics.toLowerCase().includes(query.toLowerCase())
          const matchCat = cat === 'All' || h.category === cat
          return matchQ && matchCat
        })
        setHymnsList(filtered)
        const seedCache = {}
        filtered.forEach((h) => { seedCache[h.id] = h.lyrics })
        setLyricsCache((prev) => ({ ...prev, ...seedCache }))
        setSelectedHymn((prev) =>
          prev && filtered.some((h) => h.id === prev.id) ? prev : filtered[0] || null
        )
      }
    } catch (err) {
      console.error('Failed to fetch hymns:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedLyrics = selectedHymn ? lyricsCache[selectedHymn.id] || '' : ''

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-6">
      {/* Top Header Bar: Hymn Search & Categories */}
      <div className={`p-4 rounded-xl border space-y-3.5 ${cardClass}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 border-[#26282E]">
          <div>
            <h2 className={`text-base font-bold flex items-center gap-2 ${headingClass}`}>
              <Voice2 set="bold" primaryColor="#D4A94A" size="small" /> Presbyterian & Methodist Hymnal Library
            </h2>
            <p className={`text-xs ${labelClass}`}>
              Search 855+ English & Twi hymns, liturgies, and songs by hymn number or keywords.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <div className="absolute left-3 top-2.5 pointer-events-none">
              <Search set="light" primaryColor={isLight ? '#6B7280' : '#696C75'} size="small" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hymn number (e.g. 120) or lyric keywords..."
              className={`w-full border rounded-lg pl-9 pr-3 py-2 text-xs outline-none transition ${
                isLight
                  ? 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:border-[#D4A94A]'
                  : 'bg-[#1B1C20] border-[#26282E] text-[#EDEDEE] focus:border-[#D4A94A]'
              }`}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
                <span className={`text-[11px] font-bold uppercase tracking-wider shrink-0 mr-1 ${labelClass}`}>
                  Category:
                </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition flex-1 min-w-16 text-center shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#D4A94A] text-[#0B0C0E] shadow'
                  : isLight
                  ? 'bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827]'
                  : 'bg-[#22242A] text-[#9CA0AC] hover:text-[#EDEDEE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: 2 Columns (Hymn List + Full Lyric Reader) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Hymn List (5 Columns) */}
        <div className={`lg:col-span-5 rounded-xl border p-4 flex flex-col justify-between max-h-[620px] ${cardClass}`}>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-[#D4A94A] border-b pb-2 border-[#26282E]">
              <span>Hymns Found ({hymnsList.length})</span>
              <span className={labelClass}>{selectedCategory}</span>
            </div>

            {hymnsList.length === 0 ? (
              <div className={`p-6 rounded-lg border text-center space-y-2 mt-4 ${innerCardClass}`}>
                <Voice2 set="light" primaryColor={isLight ? '#9CA0AC' : '#696C75'} size="medium" />
                <p className={`text-xs ${labelClass}`}>No hymns match your query "{searchQuery}"</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {hymnsList.map((hymn) => {
                  const isSelected = selectedHymn && selectedHymn.id === hymn.id
                  return (
                    <div
                      key={hymn.id}
                      onClick={() => handleSelectHymn(hymn)}
                      className={`p-3 rounded-lg border transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4A94A]/15 border-[#D4A94A] text-[#EDEDEE]'
                          : innerCardClass + ' hover:border-[#383B44]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-[#D4A94A]">
                          {hymnLabel(hymn)}
                        </span>
                        <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                          isLight ? 'bg-[#E5E7EB] text-[#4B5563] border-[#D1D5DB]' : 'bg-[#22242A] text-[#9CA0AC] border-[#26282E]'
                        }`}>
                          {hymn.category || 'Hymn'}
                        </span>
                      </div>
                      <h4 className={`text-xs font-bold truncate ${headingClass}`}>{hymn.title}</h4>
                      <p className={`text-[11px] line-clamp-1 mt-0.5 ${labelClass}`}>
                        {hymn.excerpt || ''}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Lyric Reader & Live Presentation Controls (7 Columns) */}
        <div className={`lg:col-span-7 rounded-xl border p-5 flex flex-col justify-between max-h-[620px] ${cardClass}`}>
          {selectedHymn ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-3 border-[#26282E]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A94A]">
                      {selectedHymn.category || 'Presbyterian Hymnal'}
                    </span>
                    <h3 className={`text-lg font-extrabold tracking-tight ${headingClass}`}>
                      {selectedHymn.hymn_number > 0 ? `${hymnLabel(selectedHymn)} — ` : ''}{selectedHymn.title}
                    </h3>
                  </div>
                  {selectedHymn.author && (
                    <span className={`text-xs italic ${labelClass}`}>{selectedHymn.author}</span>
                  )}
                </div>

                {/* Lyrics Reader Area */}
                <div className={`p-5 rounded-xl border max-h-[380px] overflow-y-auto ${innerCardClass}`}>
                  {selectedLyrics ? (
                    <pre className={`font-sans text-sm leading-relaxed whitespace-pre-wrap ${headingClass}`}>
                      {selectedLyrics}
                    </pre>
                  ) : (
                    <p className={`text-xs ${labelClass} animate-pulse`}>Loading lyrics…</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#26282E]">
                <button
                  onClick={() => handleStageNext && handleStageNext({ title: selectedHymn.title, content: selectedLyrics || selectedHymn.lyrics || '', type: 'Hymn' })}
                  className={`py-2.5 px-3 border rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                    isLight
                      ? 'bg-[#F3F4F6] hover:bg-[#E5E7EB] border-[#E5E7EB] text-[#111827]'
                      : 'bg-[#22242A] hover:bg-[#292B32] border-[#26282E] text-[#EDEDEE]'
                  }`}
                >
                  <Show set="bold" primaryColor="#D4A94A" size="small" /> Stage as Next
                </button>
                <button
                  onClick={() => handleAddToPlaylist && handleAddToPlaylist({ title: selectedHymn.title, content: selectedLyrics || selectedHymn.lyrics || '', type: 'Hymn' })}
                  className={`py-2.5 px-3 border rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                    isLight
                      ? 'bg-[#F3F4F6] hover:bg-[#E5E7EB] border-[#E5E7EB] text-[#111827]'
                      : 'bg-[#22242A] hover:bg-[#292B32] border-[#26282E] text-[#EDEDEE]'
                  }`}
                >
                  <Plus set="bold" primaryColor="#6FCF97" size="small" /> Add to Playlist
                </button>
                <button
                  onClick={() => handlePresentNow && handlePresentNow({ title: selectedHymn.title, content: selectedLyrics || selectedHymn.lyrics || '', type: 'Hymn' })}
                  className="py-2.5 px-3 bg-[#D4A94A] hover:bg-[#E2B757] text-[#0B0C0E] rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow transition cursor-pointer"
                >
                  <Send set="bold" primaryColor="#0B0C0E" size="small" /> Present Live
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-2">
              <Voice2 set="light" primaryColor={isLight ? '#9CA0AC' : '#696C75'} size="large" />
              <p className={`text-sm font-bold ${headingClass}`}>Select a Hymn to View Lyrics</p>
              <p className={`text-xs ${labelClass}`}>Choose any Presbyterian or Methodist hymn from the list on the left to read full stanzas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
