import React, { useEffect, useState, useRef, useCallback } from 'react'
import PresentationOutputWindow from './components/PresentationOutputWindow'
import IconRail from './components/IconRail'
import Header from './components/Header'
import CurrentNextRail from './components/CurrentNextRail'
import HomeView from './components/views/HomeView'
import BibleView from './components/views/BibleView'
import SongsView from './components/views/SongsView'
import PlanView from './components/views/PlanView'
import SettingsView from './components/views/SettingsView'
import AddItemModal from './components/modals/AddItemModal'
import { mapBookToTranslation, normalizeBookName } from './bibleBooks.js'

export default function App() {
  const isPresentationMode =
    typeof window !== 'undefined' &&
    (window.location.search.includes('window=presentation') ||
      window.location.href.includes('window=presentation'))

  if (isPresentationMode) {
    return <PresentationOutputWindow />
  }

  // Active Tab & Theme Mode state ('dark' | 'light' | 'system')
  const [activeTab, setActiveTab] = useState('plan')
  const [settingsSection, setSettingsSection] = useState('general')
  const [themeMode, setThemeMode] = useState('dark')
  const [systemTheme, setSystemTheme] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => setSystemTheme(e.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const effectiveTheme = themeMode === 'system' ? systemTheme : themeMode

  // Live Presentation & Transport State
  const [isLive, setIsLive] = useState(false)
  const [isBlank, setIsBlank] = useState(false)
  const [isBlack, setIsBlack] = useState(false)

  // Current Live & Next Staged Slide
  const [currentSlide, setCurrentSlide] = useState({
    id: 'slide-1',
    title: 'John 3:16 (KJV)',
    content: 'For God so loved the world, that he gave his only begotten Son...',
    type: 'Bible Verse'
  })

  const [nextSlide, setNextSlide] = useState({
    id: 'slide-2',
    title: 'Hymn #12 - Great Is Thy Faithfulness',
    content: 'Great is Thy faithfulness, O God my Father...',
    type: 'Hymn'
  })

  // Broadcast Live Slide via IPC
  const broadcastToPresentation = (overrides = {}) => {
    if (window.api && window.api.sendLiveSlide) {
      window.api.sendLiveSlide({
        title: currentSlide.title,
        content: currentSlide.content,
        type: currentSlide.type,
        isLive,
        isBlank,
        isBlack,
        ...overrides
      })
    }
  }

  // Service Playlist State
  const [playlist, setPlaylist] = useState([
    {
      id: 'item-1',
      title: 'John 3:16',
      content: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      type: 'Bible Verse',
      status: 'live'
    },
    {
      id: 'item-2',
      title: 'Hymn #12 - Great Is Thy Faithfulness',
      content: 'Great is Thy faithfulness, O God my Father, there is no shadow of turning with Thee...',
      type: 'Hymn',
      status: 'next'
    },
    {
      id: 'item-3',
      title: 'Sermon Notes - The Gift of Grace',
      content: 'Key scripture readings and main teaching points for Sunday service.',
      type: 'Custom Slide',
      status: 'pending'
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newItemTitle, setNewItemTitle] = useState('')
  const [newItemContent, setNewItemContent] = useState('')
  const [newItemType, setNewItemType] = useState('Bible Verse')

  // Hardware & System State
  const [appInfo, setAppInfo] = useState(null)
  const [dbStatus, setDbStatus] = useState(null)
  const [displays, setDisplays] = useState([])

  // Bible Scripture State
  const [biblesList, setBiblesList] = useState([])
  const [allBooksList, setAllBooksList] = useState([])
  const [selectedTranslation, setSelectedTranslation] = useState('NIV')
  const [selectedBook, setSelectedBook] = useState('John')
  const [selectedChapter, setSelectedChapter] = useState(3)
  const [searchQuery, setSearchQuery] = useState('')
  const [dbVerses, setDbVerses] = useState([])
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0)
  const searchInputRef = useRef(null)

  const fallbackVerses = [
    {
      id: 1,
      ref: 'John 3:16',
      book: 'John',
      chapter: 3,
      verse: 16,
      text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.'
    },
    {
      id: 2,
      ref: 'John 3:17',
      book: 'John',
      chapter: 3,
      verse: 17,
      text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.'
    },
    {
      id: 3,
      ref: 'Genesis 1:1',
      book: 'Genesis',
      chapter: 1,
      verse: 1,
      text: 'In the beginning God created the heaven and the earth.'
    },
    {
      id: 4,
      ref: 'Genesis 1:3',
      book: 'Genesis',
      chapter: 1,
      verse: 3,
      text: 'And God said, Let there be light: and there was light.'
    },
    {
      id: 5,
      ref: 'Psalms 23:1',
      book: 'Psalms',
      chapter: 23,
      verse: 1,
      text: 'The LORD is my shepherd; I shall not want.'
    }
  ]

  // Fetch Bibles from SQLite on mount
  useEffect(() => {
    if (window.api && window.api.getBibles) {
      window.api.getBibles().then((list) => {
        if (list && list.length > 0) setBiblesList(list)
      })
    }
  }, [])

  // Re-fetch the Bible list after imports/deletes in Settings
  const refreshBibles = useCallback(() => {
    if (window.api && window.api.getBibles) {
      window.api.getBibles().then((list) => {
        if (list && list.length > 0) setBiblesList(list)
      })
    }
  }, [])

  // Fetch all books for active Bible translation
  useEffect(() => {
    if (!window.api) return
    const activeBible = biblesList.find((b) => b.code === selectedTranslation) || biblesList[0]
    const bibleId = activeBible ? activeBible.id : 1

    if (window.api.getBooks) {
      window.api.getBooks(bibleId).then((books) => {
        if (books && books.length > 0) {
          setAllBooksList(books)
          // Keep the selected book valid across translations (English <-> Twi).
          const normalized = normalizeBookName(selectedBook)
          const found = books.find((b) => normalizeBookName(b.name) === normalized)
          if (!found) {
            const mappedName = mapBookToTranslation(selectedBook, selectedTranslation)
            const target = books.find((b) => normalizeBookName(b.name) === normalizeBookName(mappedName)) || books[0]
            if (target) {
              setSelectedBook(target.name)
              setSelectedChapter((prev) => Math.min(prev || 1, target.chaptersCount || 1))
              setSelectedVerseIndex(0)
            }
          } else if (found.chaptersCount) {
            setSelectedChapter((prev) => Math.min(prev || 1, found.chaptersCount))
          }
        }
      })
    }
  }, [selectedTranslation, biblesList])

  // Fetch verses dynamically from SQLite
  useEffect(() => {
    if (!window.api) return

    const activeBible = biblesList.find((b) => b.code === selectedTranslation) || biblesList[0]
    const bibleId = activeBible ? activeBible.id : 1

    if (searchQuery.trim()) {
      if (window.api.searchVerses) {
        window.api.searchVerses(searchQuery, bibleId).then((results) => {
          if (results && results.length > 0) {
            setDbVerses(
              results.map((r) => ({
                id: r.id,
                ref: `${r.book_name || 'Verse'} ${r.chapter}:${r.verse}`,
                book: r.book_name || 'Verse',
                chapter: r.chapter,
                verse: r.verse,
                text: r.text
              }))
            )
          } else {
            setDbVerses([])
          }
        })
      }
    } else {
      if (window.api.getBooks) {
        window.api.getBooks(bibleId).then((books) => {
          if (!books || books.length === 0) return
          const matchedBook = books.find((b) => normalizeBookName(b.name) === normalizeBookName(selectedBook))
          if (!matchedBook || !window.api.getVerses) return
          window.api.getVerses(matchedBook.id, selectedChapter).then((verses) => {
            if (verses && verses.length > 0) {
              setDbVerses(
                verses.map((v) => ({
                  id: v.id,
                  ref: `${matchedBook.name} ${v.chapter}:${v.verse}`,
                  book: matchedBook.name,
                  chapter: v.chapter,
                  verse: v.verse,
                  text: v.text
                }))
              )
            }
          })
        })
      }
    }
  }, [searchQuery, selectedTranslation, selectedBook, selectedChapter, biblesList])

  useEffect(() => {
    if (window.api) {
      if (window.api.getAppInfo) window.api.getAppInfo().then(setAppInfo)
      if (window.api.getDbStatus) window.api.getDbStatus().then(setDbStatus)
      if (window.api.getDisplays) window.api.getDisplays().then(setDisplays)
      if (window.api.onDisplaysChanged) {
        const unsubscribe = window.api.onDisplaysChanged(setDisplays)
        return unsubscribe
      }
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'bible' && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [activeTab])

  const filteredVerses = dbVerses.length > 0
    ? dbVerses
    : searchQuery.trim()
    ? fallbackVerses.filter(
        (v) =>
          v.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : fallbackVerses.filter(
        (v) => v.book === selectedBook && v.chapter === selectedChapter
      )

  const activeSelectedVerse =
    filteredVerses[selectedVerseIndex] || filteredVerses[0] || fallbackVerses[0]

  const handleAddToPlaylist = (verse) => {
    if (!verse) return
    const newItem = {
      id: `item-${Date.now()}`,
      title: `${verse.ref} (${selectedTranslation})`,
      content: verse.text,
      type: 'Bible Verse',
      status: 'pending'
    }
    setPlaylist((prev) => [...prev, newItem])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedVerseIndex((prev) =>
        prev < filteredVerses.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedVerseIndex((prev) => (prev > 0 ? prev - 1 : 0))
    }
  }

  // Playlist Handlers
  const handleSelectItem = (item) => {
    setNextSlide({
      id: item.id,
      title: item.title,
      content: item.content,
      type: item.type
    })

    setPlaylist((prev) =>
      prev.map((i) => {
        if (i.id === item.id) return { ...i, status: 'next' }
        if (i.status === 'next') return { ...i, status: 'pending' }
        return i
      })
    )
  }

  const handlePresentItemNow = (item) => {
    const updatedSlide = {
      id: item.id,
      title: item.title,
      content: item.content,
      type: item.type
    }
    setCurrentSlide(updatedSlide)
    setIsLive(true)
    setIsBlack(false)
    setIsBlank(false)

    broadcastToPresentation({
      title: item.title,
      content: item.content,
      type: item.type,
      isLive: true,
      isBlack: false,
      isBlank: false
    })

    setPlaylist((prev) =>
      prev.map((i) => {
        if (i.id === item.id) return { ...i, status: 'live' }
        if (i.status === 'live') return { ...i, status: 'pending' }
        return i
      })
    )
  }

  const handleMoveUp = (index) => {
    if (index === 0) return
    const updated = [...playlist]
    const temp = updated[index - 1]
    updated[index - 1] = updated[index]
    updated[index] = temp
    setPlaylist(updated)
  }

  const handleMoveDown = (index) => {
    if (index === playlist.length - 1) return
    const updated = [...playlist]
    const temp = updated[index + 1]
    updated[index + 1] = updated[index]
    updated[index] = temp
    setPlaylist(updated)
  }

  const handleDeleteItem = (id) => {
    setPlaylist((prev) => prev.filter((i) => i.id !== id))
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    if (!newItemTitle.trim() || !newItemContent.trim()) return

    const newItem = {
      id: `item-${Date.now()}`,
      title: newItemTitle,
      content: newItemContent,
      type: newItemType,
      status: 'pending'
    }

    setPlaylist((prev) => [...prev, newItem])
    setNewItemTitle('')
    setNewItemContent('')
    setShowAddModal(false)
  }

  // Scripture Transport Handlers
  const handleStageNext = (verse) => {
    setNextSlide({
      id: `verse-${verse.id}`,
      title: `${verse.ref} (${selectedTranslation})`,
      content: verse.text,
      type: 'Bible Verse'
    })
  }

  const handlePresentNow = (verse) => {
    const updated = {
      id: `verse-${verse.id}`,
      title: `${verse.ref} (${selectedTranslation})`,
      content: verse.text,
      type: 'Bible Verse'
    }
    setCurrentSlide(updated)
    setIsLive(true)
    setIsBlack(false)
    setIsBlank(false)

    broadcastToPresentation({
      title: updated.title,
      content: updated.content,
      type: updated.type,
      isLive: true,
      isBlack: false,
      isBlank: false
    })
  }

  const handleTransportPresent = () => {
    if (nextSlide) {
      setCurrentSlide(nextSlide)
      setIsLive(true)
      setIsBlack(false)
      setIsBlank(false)

      broadcastToPresentation({
        title: nextSlide.title,
        content: nextSlide.content,
        type: nextSlide.type,
        isLive: true,
        isBlack: false,
        isBlank: false
      })
    }
  }

  const handleTransportStop = () => {
    setIsLive(false)
    broadcastToPresentation({ isLive: false })
  }

  const handleToggleBlack = () => {
    const nextState = !isBlack
    setIsBlack(nextState)
    broadcastToPresentation({ isBlack: nextState })
  }

  const handleToggleClear = () => {
    const nextState = !isBlank
    setIsBlank(nextState)
    broadcastToPresentation({ isBlank: nextState })
  }

  const handleTransportPrev = () => {
    if (selectedVerseIndex > 0) {
      const prevVerse = filteredVerses[selectedVerseIndex - 1]
      setSelectedVerseIndex(selectedVerseIndex - 1)
      setNextSlide({
        id: `verse-${prevVerse.id}`,
        title: `${prevVerse.ref} (${selectedTranslation})`,
        content: prevVerse.text,
        type: 'Bible Verse'
      })
    }
  }

  const handleTransportNext = () => {
    if (selectedVerseIndex < filteredVerses.length - 1) {
      const nextV = filteredVerses[selectedVerseIndex + 1]
      setSelectedVerseIndex(selectedVerseIndex + 1)
      setNextSlide({
        id: `verse-${nextV.id}`,
        title: `${nextV.ref} (${selectedTranslation})`,
        content: nextV.text,
        type: 'Bible Verse'
      })
    }
  }

  return (
    <div
      className={`flex h-screen font-sans overflow-hidden select-none transition-colors duration-200 ${
        effectiveTheme === 'light'
          ? 'bg-[#F4F5F7] text-[#111827]'
          : 'bg-[#0B0C0E] text-[#EDEDEE]'
      }`}
      onKeyDown={handleKeyDown}
    >
      {/* 1. ICON RAIL (Fixed 52px width) */}
      <IconRail activeTab={activeTab} setActiveTab={setActiveTab} themeMode={effectiveTheme} />

      {/* CENTER WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP STATUS BAR */}
        <Header
          displays={displays}
          isLive={isLive}
          setIsLive={setIsLive}
          broadcastToPresentation={broadcastToPresentation}
          themeMode={themeMode}
          effectiveTheme={effectiveTheme}
          setThemeMode={setThemeMode}
        />

        {/* MAIN ROUTED VIEW CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-5 text-xs">
          {activeTab === 'home' && <HomeView themeMode={effectiveTheme} />}

          {activeTab === 'bible' && (
            <BibleView
              biblesList={biblesList}
              allBooksList={allBooksList}
              selectedTranslation={selectedTranslation}
              setSelectedTranslation={setSelectedTranslation}
              selectedBook={selectedBook}
              setSelectedBook={setSelectedBook}
              selectedChapter={selectedChapter}
              setSelectedChapter={setSelectedChapter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedVerseIndex={selectedVerseIndex}
              setSelectedVerseIndex={setSelectedVerseIndex}
              searchInputRef={searchInputRef}
              filteredVerses={filteredVerses}
              activeSelectedVerse={activeSelectedVerse}
              handleStageNext={handleStageNext}
              handlePresentNow={handlePresentNow}
              handleAddToPlaylist={handleAddToPlaylist}
              themeMode={effectiveTheme}
            />
          )}

          {activeTab === 'songs' && <SongsView themeMode={effectiveTheme} />}

          {activeTab === 'plan' && (
            <PlanView
              playlist={playlist}
              setShowAddModal={setShowAddModal}
              handleSelectItem={handleSelectItem}
              handlePresentItemNow={handlePresentItemNow}
              handleMoveUp={handleMoveUp}
              handleMoveDown={handleMoveDown}
              handleDeleteItem={handleDeleteItem}
              themeMode={effectiveTheme}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settingsSection={settingsSection}
              setSettingsSection={setSettingsSection}
              appInfo={appInfo}
              dbStatus={dbStatus}
              displays={displays}
              setDisplays={setDisplays}
              selectedTranslation={selectedTranslation}
              setSelectedTranslation={setSelectedTranslation}
              themeMode={themeMode}
              effectiveTheme={effectiveTheme}
              setThemeMode={setThemeMode}
              biblesList={biblesList}
              refreshBibles={refreshBibles}
            />
          )}
        </main>
      </div>

      {/* 3. CURRENT / NEXT RAIL & TRANSPORT CONTROLS */}
      <CurrentNextRail
        currentSlide={currentSlide}
        nextSlide={nextSlide}
        isLive={isLive}
        isBlack={isBlack}
        isBlank={isBlank}
        selectedVerseIndex={selectedVerseIndex}
        filteredVersesLength={filteredVerses.length}
        handleTransportPrev={handleTransportPrev}
        handleTransportNext={handleTransportNext}
        handleToggleClear={handleToggleClear}
        handleToggleBlack={handleToggleBlack}
        handleTransportPresent={handleTransportPresent}
        handleTransportStop={handleTransportStop}
        themeMode={effectiveTheme}
      />

      {/* ADD ITEM MODAL */}
      <AddItemModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newItemTitle={newItemTitle}
        setNewItemTitle={setNewItemTitle}
        newItemContent={newItemContent}
        setNewItemContent={setNewItemContent}
        newItemType={newItemType}
        setNewItemType={setNewItemType}
        handleAddItem={handleAddItem}
        themeMode={effectiveTheme}
      />
    </div>
  )
}
