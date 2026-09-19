import React, { useEffect, useState, useRef, useCallback } from "react";
import PresentationOutputWindow from "./components/PresentationOutputWindow";
import IconRail from "./components/IconRail";
import Header from "./components/Header";
import CurrentNextRail from "./components/CurrentNextRail";
import HomeView from "./components/views/HomeView";
import BibleView from "./components/views/BibleView";
import SongsView from "./components/views/SongsView";
import PlanView from "./components/views/PlanView";
import SettingsView from "./components/views/SettingsView";
import AddItemModal from "./components/modals/AddItemModal";
import { Toaster } from "sonner";
import { mapBookToTranslation, normalizeBookName } from "./bibleBooks.js";

// Split a hymn's lyrics at blank lines into separate stanza slides so hymns can
// also be presented verse-by-verse (stanza-by-stanza) like scripture.
const splitHymnStanzas = (lyrics) => {
  if (!lyrics) return [""];
  return String(lyrics)
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const buildHymnDeck = (item) => {
  const stanzas = splitHymnStanzas(item.content || item.lyrics);
  return stanzas.map((s) => ({
    id: `hymn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: item.title || "Untitled",
    content: s,
    type: "Hymn",
  }));
};

export default function App() {
  const isPresentationMode =
    typeof window !== "undefined" &&
    (window.location.search.includes("window=presentation") ||
      window.location.href.includes("window=presentation"));

  if (isPresentationMode) {
    return <PresentationOutputWindow />;
  }

  // Active Tab & Theme Mode state ('dark' | 'light' | 'system') persisted in localStorage
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = localStorage.getItem("church_presenter_startup_tab");
      if (
        saved &&
        ["home", "plan", "bible", "songs", "settings"].includes(saved)
      )
        return saved;
    }
    return "home";
  });
  const [settingsSection, setSettingsSection] = useState("general");
  const [startupTab, setStartupTab] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = localStorage.getItem("church_presenter_startup_tab");
      if (
        saved &&
        ["home", "plan", "bible", "songs", "settings"].includes(saved)
      )
        return saved;
    }
    return "home";
  });
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = localStorage.getItem("church_presenter_theme_mode");
      if (saved === "dark" || saved === "light" || saved === "system")
        return saved;
    }
    return "dark";
  });

  const [systemTheme, setSystemTheme] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark",
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setSystemTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("church_presenter_theme_mode", themeMode);
    }
  }, [themeMode]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("church_presenter_startup_tab", startupTab);
    }
  }, [startupTab]);

  const effectiveTheme = themeMode === "system" ? systemTheme : themeMode;

  // Live Presentation & Transport State
  const [isLive, setIsLive] = useState(false);
  const [isBlank, setIsBlank] = useState(false);
  const [isBlack, setIsBlack] = useState(false);

  // Live Output Presentation Theme & Background State
  const [outputTheme, setOutputTheme] = useState(() => {
    return localStorage.getItem("church_presenter_output_theme") || "dark";
  });
  const [outputBgImage, setOutputBgImage] = useState(() => {
    return localStorage.getItem("church_presenter_output_bg_image") || "";
  });

  const [showVerseQuotes, setShowVerseQuotes] = useState(() => {
    return localStorage.getItem("church_presenter_show_quotes") !== "false";
  });

  const [appNamePosition, setAppNamePosition] = useState(() => {
    return localStorage.getItem("church_presenter_app_name_pos") || "top-left";
  });

  const [customHeaderTitle, setCustomHeaderTitle] = useState(() => {
    return (
      localStorage.getItem("church_presenter_header_title") || "WorshipDesk"
    );
  });

  const [uiScale, setUiScale] = useState(() => {
    return localStorage.getItem("church_presenter_ui_scale") || "normal";
  });

  const [slideMargin, setSlideMargin] = useState(() => {
    return localStorage.getItem("church_presenter_slide_margin") || "4rem";
  });

  const [attributionPosition, setAttributionPosition] = useState(() => {
    return localStorage.getItem("church_presenter_attribution_pos") || "bottom";
  });

  const [outputFontSize, setOutputFontSize] = useState(() => {
    return (
      localStorage.getItem("church_presenter_output_font_size") || "normal"
    );
  });

  const [defaultHymnCategory, setDefaultHymnCategory] = useState(() => {
    return localStorage.getItem("church_presenter_default_hymn_cat") || "All";
  });

  const [showHymnNumbers, setShowHymnNumbers] = useState(() => {
    return localStorage.getItem("church_presenter_show_hymn_nums") !== "false";
  });

  const [hymnTextScale, setHymnTextScale] = useState(() => {
    return localStorage.getItem("church_presenter_hymn_text_scale") || "normal";
  });

  const [projectionDisplays, setProjectionDisplays] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const saved = JSON.parse(
          localStorage.getItem("church_presenter_projection_displays") || "[]",
        );
        return Array.isArray(saved) ? saved.map(Number) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("church_presenter_output_theme", outputTheme);
  }, [outputTheme]);

  useEffect(() => {
    localStorage.setItem("church_presenter_output_bg_image", outputBgImage);
  }, [outputBgImage]);

  useEffect(() => {
    localStorage.setItem(
      "church_presenter_show_quotes",
      showVerseQuotes ? "true" : "false",
    );
  }, [showVerseQuotes]);

  useEffect(() => {
    localStorage.setItem("church_presenter_app_name_pos", appNamePosition);
  }, [appNamePosition]);

  useEffect(() => {
    localStorage.setItem("church_presenter_header_title", customHeaderTitle);
  }, [customHeaderTitle]);

  useEffect(() => {
    localStorage.setItem("church_presenter_ui_scale", uiScale);
  }, [uiScale]);

  useEffect(() => {
    localStorage.setItem("church_presenter_slide_margin", slideMargin);
  }, [slideMargin]);

  useEffect(() => {
    localStorage.setItem(
      "church_presenter_attribution_pos",
      attributionPosition,
    );
  }, [attributionPosition]);

  useEffect(() => {
    localStorage.setItem("church_presenter_output_font_size", outputFontSize);
  }, [outputFontSize]);

  useEffect(() => {
    localStorage.setItem(
      "church_presenter_default_hymn_cat",
      defaultHymnCategory,
    );
  }, [defaultHymnCategory]);

  useEffect(() => {
    localStorage.setItem(
      "church_presenter_show_hymn_nums",
      showHymnNumbers ? "true" : "false",
    );
  }, [showHymnNumbers]);

  useEffect(() => {
    localStorage.setItem("church_presenter_hymn_text_scale", hymnTextScale);
  }, [hymnTextScale]);

  useEffect(() => {
    localStorage.setItem(
      "church_presenter_projection_displays",
      JSON.stringify(projectionDisplays),
    );
  }, [projectionDisplays]);

  // Open/close projector windows so the selected displays receive live output.
  useEffect(() => {
    if (window.api && window.api.openPresentationWindows) {
      window.api.openPresentationWindows(projectionDisplays);
    }
  }, [projectionDisplays]);

  // Current Live & Next Staged Slide
  const [currentSlide, setCurrentSlide] = useState({});

  const [nextSlide, setNextSlide] = useState({});

  // Service Playlist State
  const [playlist, setPlaylist] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemContent, setNewItemContent] = useState("");
  const [newItemType, setNewItemType] = useState("Bible Verse");

  // Hardware & System State
  const [appInfo, setAppInfo] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [displays, setDisplays] = useState([]);

  // Bible Scripture State
  const [biblesList, setBiblesList] = useState([]);
  const [allBooksList, setAllBooksList] = useState([]);
  const [selectedTranslation, setSelectedTranslation] = useState("NIV");
  const [selectedBook, setSelectedBook] = useState("John");
  const [selectedChapter, setSelectedChapter] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [dbVerses, setDbVerses] = useState([]);
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0);
  // Hymn stanza deck (set when presenting a hymn so it navigates stanza by stanza)
  const [hymnDeck, setHymnDeck] = useState([]);
  const [hymnDeckIndex, setHymnDeckIndex] = useState(0);
  const searchInputRef = useRef(null);

  // Fetch Bibles from SQLite on mount
  useEffect(() => {
    if (window.api && window.api.getBibles) {
      window.api.getBibles().then((list) => {
        if (list && list.length > 0) setBiblesList(list);
      });
    }
  }, []);

  // Re-fetch the Bible list after imports/deletes in Settings
  const refreshBibles = useCallback(() => {
    if (window.api && window.api.getBibles) {
      window.api.getBibles().then((list) => {
        if (list && list.length > 0) setBiblesList(list);
      });
    }
  }, []);

  // Fetch all books for active Bible translation
  useEffect(() => {
    if (!window.api) return;
    const activeBible =
      biblesList.find((b) => b.code === selectedTranslation) || biblesList[0];
    const bibleId = activeBible ? activeBible.id : 1;

    if (window.api.getBooks) {
      window.api.getBooks(bibleId).then((books) => {
        if (books && books.length > 0) {
          setAllBooksList(books);
          // Keep the selected book valid across translations (English <-> Twi).
          const normalized = normalizeBookName(selectedBook);
          const found = books.find(
            (b) => normalizeBookName(b.name) === normalized,
          );
          if (!found) {
            const mappedName = mapBookToTranslation(
              selectedBook,
              selectedTranslation,
            );
            const target =
              books.find(
                (b) =>
                  normalizeBookName(b.name) === normalizeBookName(mappedName),
              ) || books[0];
            if (target) {
              setSelectedBook(target.name);
              setSelectedChapter((prev) =>
                Math.min(prev || 1, target.chaptersCount || 1),
              );
              setSelectedVerseIndex(0);
            }
          } else if (found.chaptersCount) {
            setSelectedChapter((prev) =>
              Math.min(prev || 1, found.chaptersCount),
            );
          }
        }
      });
    }
  }, [selectedTranslation, biblesList]);

  // Fetch verses dynamically from SQLite
  // (search is debounced so results keep up with fast typing instead of lagging behind)
  useEffect(() => {
    if (!window.api) return;

    const activeBible =
      biblesList.find((b) => b.code === selectedTranslation) || biblesList[0];
    const bibleId = activeBible ? activeBible.id : 1;

    let stale = false;
    const timer = setTimeout(
      () => {
        if (searchQuery.trim()) {
          if (window.api.searchVerses) {
            window.api
              .searchVerses(searchQuery.trim(), bibleId)
              .then((results) => {
                if (stale) return;
                if (results && results.length > 0) {
                  setDbVerses(
                    results.map((r) => ({
                      id: r.id,
                      ref: `${r.book_name || "Verse"} ${r.chapter}:${r.verse}`,
                      book: r.book_name || "Verse",
                      chapter: r.chapter,
                      verse: r.verse,
                      text: r.text,
                    })),
                  );
                } else {
                  setDbVerses([]);
                }
              });
          }
        } else {
          if (window.api.getBooks) {
            window.api.getBooks(bibleId).then((books) => {
              if (stale) return;
              if (!books || books.length === 0) return;
              const matchedBook = books.find(
                (b) =>
                  normalizeBookName(b.name) === normalizeBookName(selectedBook),
              );
              if (!matchedBook || !window.api.getVerses) return;
              window.api
                .getVerses(matchedBook.id, selectedChapter)
                .then((verses) => {
                  if (stale) return;
                  if (verses && verses.length > 0) {
                    setDbVerses(
                      verses.map((v) => ({
                        id: v.id,
                        ref: `${matchedBook.name} ${v.chapter}:${v.verse}`,
                        book: matchedBook.name,
                        chapter: v.chapter,
                        verse: v.verse,
                        text: v.text,
                      })),
                    );
                  } else {
                    setDbVerses([]);
                  }
                });
            });
          }
        }
      },
      searchQuery.trim() ? 250 : 0,
    );
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [
    searchQuery,
    selectedTranslation,
    selectedBook,
    selectedChapter,
    biblesList,
  ]);

  useEffect(() => {
    if (window.api) {
      if (window.api.getAppInfo) window.api.getAppInfo().then(setAppInfo);
      if (window.api.getDbStatus) window.api.getDbStatus().then(setDbStatus);
      if (window.api.getDisplays) window.api.getDisplays().then(setDisplays);
      if (window.api.onDisplaysChanged) {
        const unsubscribe = window.api.onDisplaysChanged(setDisplays);
        return unsubscribe;
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === "bible" && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [activeTab]);

  // Once a real Bible is imported we never fall back to the demo verses,
  // so an empty search result correctly shows nothing instead of placeholder data.
  const hasRealBibles = biblesList && biblesList.length > 0;
  const filteredVerses =
    dbVerses.length > 0 ? dbVerses : hasRealBibles ? [] : searchQuery.trim();

  const activeSelectedVerse =
    filteredVerses[selectedVerseIndex] ||
    filteredVerses[0] ||
    (hasRealBibles ?? null);

  // Broadcast Live Slide via IPC
  const broadcastToPresentation = useCallback(
    (overrides = {}) => {
      if (window.api && window.api.sendLiveSlide) {
        const isVerseDeck =
          (currentSlide?.type || "Bible Verse") === "Bible Verse";
        const isHymnDeckActive = !isVerseDeck && hymnDeck.length > 1;
        window.api.sendLiveSlide({
          title: currentSlide?.title || currentSlide?.ref || "",
          content: currentSlide?.content || currentSlide?.text || "",
          type: currentSlide?.type || "Bible Verse",
          isLive,
          isBlank,
          isBlack,
          outputTheme,
          outputBgImage,
          showVerseQuotes,
          appNamePosition,
          customHeaderTitle,
          slideMargin,
          attributionPosition,
          outputFontSize,
          deckPosition: isVerseDeck
            ? Math.min(selectedVerseIndex + 1, filteredVerses.length)
            : isHymnDeckActive
              ? hymnDeckIndex + 1
              : 0,
          deckTotal: isVerseDeck
            ? filteredVerses.length
            : isHymnDeckActive
              ? hymnDeck.length
              : 0,
          ...overrides,
        });
      }
    },
    [
      currentSlide,
      isLive,
      isBlank,
      isBlack,
      outputTheme,
      outputBgImage,
      showVerseQuotes,
      appNamePosition,
      customHeaderTitle,
      slideMargin,
      attributionPosition,
      outputFontSize,
      selectedVerseIndex,
      filteredVerses.length,
      hymnDeck,
      hymnDeckIndex,
    ],
  );

  useEffect(() => {
    broadcastToPresentation();
  }, [broadcastToPresentation]);

  const normalizeSlide = (item) => {
    if (!item) return null;
    const isVerse = !!item.ref;
    return {
      title: isVerse
        ? `${item.ref} (${selectedTranslation})`
        : item.title || "Untitled",
      content: isVerse ? item.text : item.content || "",
      type: isVerse ? "Bible Verse" : item.type || "Custom Slide",
    };
  };

  const handleAddToPlaylist = (item) => {
    const slide = normalizeSlide(item);
    if (!slide || !slide.title.trim() || !slide.content.trim()) return;
    setPlaylist((prev) => [
      ...prev,
      { ...slide, id: `item-${Date.now()}`, status: "pending" },
    ]);
  };

  const handleKeyDown = (e) => {
    const tag =
      e.target && e.target.tagName ? e.target.tagName.toUpperCase() : "";
    if (
      /INPUT|TEXTAREA|SELECT/.test(tag) ||
      (e.target && e.target.isContentEditable)
    )
      return;
    if (tag === "BUTTON" || tag === "A") return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedVerseIndex((prev) =>
        prev < filteredVerses.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedVerseIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault();
      handleTransportPresentNext();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      handleTransportPresentPrev();
    } else if (e.key === " ") {
      e.preventDefault();
      if (activeSelectedVerse) handlePresentNow(activeSelectedVerse);
    }
  };

  // Playlist Handlers
  const handleSelectItem = (item) => {
    setNextSlide({
      id: item.id,
      title: item.title,
      content: item.content,
      type: item.type,
    });

    setPlaylist((prev) =>
      prev.map((i) => {
        if (i.id === item.id) return { ...i, status: "next" };
        if (i.status === "next") return { ...i, status: "pending" };
        return i;
      }),
    );
  };

  const handlePresentItemNow = (item) => {
    const isHymn = !!item && item.type === "Hymn";
    let updatedSlide;
    if (isHymn) {
      const slides = buildHymnDeck(item);
      setHymnDeck(slides);
      setHymnDeckIndex(0);
      updatedSlide = slides[0];
    } else {
      setHymnDeck([]);
      setHymnDeckIndex(0);
      updatedSlide = {
        id: item.id,
        title: item.title,
        content: item.content,
        type: item.type,
      };
    }
    setCurrentSlide(updatedSlide);
    setIsLive(true);
    setIsBlack(false);
    setIsBlank(false);

    broadcastToPresentation({
      title: updatedSlide.title,
      content: updatedSlide.content,
      type: updatedSlide.type,
      isLive: true,
      isBlack: false,
      isBlank: false,
    });

    setPlaylist((prev) =>
      prev.map((i) => {
        if (i.id === item.id) return { ...i, status: "live" };
        if (i.status === "live") return { ...i, status: "pending" };
        return i;
      }),
    );
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...playlist];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setPlaylist(updated);
  };

  const handleMoveDown = (index) => {
    if (index === playlist.length - 1) return;
    const updated = [...playlist];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setPlaylist(updated);
  };

  const handleDeleteItem = (id) => {
    setPlaylist((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemTitle.trim() || !newItemContent.trim()) return;

    const newItem = {
      id: `item-${Date.now()}`,
      title: newItemTitle,
      content: newItemContent,
      type: newItemType,
      status: "pending",
    };

    setPlaylist((prev) => [...prev, newItem]);
    setNewItemTitle("");
    setNewItemContent("");
    setShowAddModal(false);
  };

  // Scripture Transport Handlers
  const handleStageNext = (item) => {
    const slide = normalizeSlide(item);
    if (!slide) return;
    setNextSlide({ id: `item-${Date.now()}`, ...slide });
  };

  const handlePresentNow = (item) => {
    const isVerse = !!(item && item.ref);
    const isHymn = !!item && item.type === "Hymn";
    let updated;
    if (isHymn) {
      const slides = buildHymnDeck(item);
      setHymnDeck(slides);
      setHymnDeckIndex(0);
      updated = slides[0];
    } else {
      setHymnDeck([]);
      setHymnDeckIndex(0);
      updated = {
        id: item.id ? `verse-${item.id}` : `present-${Date.now()}`,
        title: isVerse
          ? `${item.ref} (${selectedTranslation})`
          : item.title || "",
        content: isVerse ? item.text : item.content || "",
        type: item.type || "Bible Verse",
      };
    }
    setCurrentSlide(updated);
    setIsLive(true);
    setIsBlack(false);
    setIsBlank(false);

    broadcastToPresentation({
      title: updated.title,
      content: updated.content,
      type: updated.type,
      isLive: true,
      isBlack: false,
      isBlank: false,
    });
  };

  const handleTransportPresent = () => {
    if (nextSlide) {
      let toPresent = nextSlide;
      if (nextSlide.type === "Hymn") {
        const slides = buildHymnDeck(nextSlide);
        setHymnDeck(slides);
        setHymnDeckIndex(0);
        toPresent = slides[0];
      }
      setCurrentSlide(toPresent);
      setIsLive(true);
      setIsBlack(false);
      setIsBlank(false);

      broadcastToPresentation({
        title: toPresent.title,
        content: toPresent.content,
        type: toPresent.type,
        isLive: true,
        isBlack: false,
        isBlank: false,
      });
    }
  };

  const handleTransportStop = () => {
    setIsLive(false);
    broadcastToPresentation({ isLive: false });
  };

  const handleToggleBlack = () => {
    const nextState = !isBlack;
    setIsBlack(nextState);
    broadcastToPresentation({ isBlack: nextState });
  };

  const handleToggleClear = () => {
    const nextState = !isBlank;
    setIsBlank(nextState);
    broadcastToPresentation({ isBlank: nextState });
  };

  const handleTransportPrev = () => {
    if (selectedVerseIndex > 0) {
      const prevVerse = filteredVerses[selectedVerseIndex - 1];
      setSelectedVerseIndex(selectedVerseIndex - 1);
      setNextSlide({
        id: `verse-${prevVerse.id}`,
        title: `${prevVerse.ref} (${selectedTranslation})`,
        content: prevVerse.text,
        type: "Bible Verse",
      });
    }
  };

  const handleTransportNext = () => {
    if (selectedVerseIndex < filteredVerses.length - 1) {
      const nextV = filteredVerses[selectedVerseIndex + 1];
      setSelectedVerseIndex(selectedVerseIndex + 1);
      setNextSlide({
        id: `verse-${nextV.id}`,
        title: `${nextV.ref} (${selectedTranslation})`,
        content: nextV.text,
        type: "Bible Verse",
      });
    }
  };

  // Advance to the next verse/stanza AND present it in one action.
  const handleTransportPresentNext = () => {
    const isHymnDeckActive =
      hymnDeck.length > 1 && currentSlide?.type === "Hymn";
    if (isHymnDeckActive) {
      if (hymnDeckIndex < hymnDeck.length - 1) {
        const nI = hymnDeckIndex + 1;
        const slide = hymnDeck[nI];
        setHymnDeckIndex(nI);
        setCurrentSlide(slide);
        setIsLive(true);
        setIsBlack(false);
        setIsBlank(false);
        broadcastToPresentation({
          ...slide,
          isLive: true,
          isBlack: false,
          isBlank: false,
        });
      }
    } else if (selectedVerseIndex < filteredVerses.length - 1) {
      const nextV = filteredVerses[selectedVerseIndex + 1];
      const updated = {
        id: `verse-${nextV.id}`,
        title: `${nextV.ref} (${selectedTranslation})`,
        content: nextV.text,
        type: "Bible Verse",
      };
      setSelectedVerseIndex(selectedVerseIndex + 1);
      setNextSlide(updated);
      setCurrentSlide(updated);
      setIsLive(true);
      setIsBlack(false);
      setIsBlank(false);

      broadcastToPresentation({
        ...updated,
        isLive: true,
        isBlack: false,
        isBlank: false,
      });
    }
  };

  // Go back to the previous verse/stanza AND present it in one action.
  const handleTransportPresentPrev = () => {
    const isHymnDeckActive =
      hymnDeck.length > 1 && currentSlide?.type === "Hymn";
    if (isHymnDeckActive) {
      if (hymnDeckIndex > 0) {
        const pI = hymnDeckIndex - 1;
        const slide = hymnDeck[pI];
        setHymnDeckIndex(pI);
        setCurrentSlide(slide);
        setIsLive(true);
        setIsBlack(false);
        setIsBlank(false);
        broadcastToPresentation({
          ...slide,
          isLive: true,
          isBlack: false,
          isBlank: false,
        });
      }
    } else if (selectedVerseIndex > 0) {
      const prevV = filteredVerses[selectedVerseIndex - 1];
      const updated = {
        id: `verse-${prevV.id}`,
        title: `${prevV.ref} (${selectedTranslation})`,
        content: prevV.text,
        type: "Bible Verse",
      };
      setSelectedVerseIndex(selectedVerseIndex - 1);
      setNextSlide(updated);
      setCurrentSlide(updated);
      setIsLive(true);
      setIsBlack(false);
      setIsBlank(false);

      broadcastToPresentation({
        ...updated,
        isLive: true,
        isBlack: false,
        isBlank: false,
      });
    }
  };

  // Arrows pressed on the projector window advance the verse deck here.
  useEffect(() => {
    if (window.api && window.api.onDeckNav) {
      const unsubscribe = window.api.onDeckNav((dir) => {
        if (dir === "next") handleTransportPresentNext();
        else if (dir === "prev") handleTransportPresentPrev();
      });
      return unsubscribe;
    }
  }, [handleTransportPresentNext, handleTransportPresentPrev]);

  const isHymnDeckActive = hymnDeck.length > 1 && currentSlide?.type === "Hymn";
  const presentNextDisabled =
    !isLive ||
    (isHymnDeckActive
      ? hymnDeckIndex >= hymnDeck.length - 1
      : selectedVerseIndex >= filteredVerses.length - 1 ||
        filteredVerses.length === 0);
  const presentPrevDisabled = isHymnDeckActive
    ? hymnDeckIndex <= 0
    : selectedVerseIndex <= 0;

  return (
    <div
      className={`flex h-screen font-sans overflow-hidden select-none transition-colors duration-200 ${
        effectiveTheme === "light"
          ? "bg-[#F4F5F7] text-[#111827]"
          : "bg-bg text-text-primary"
      }`}
      style={{
        fontSize:
          uiScale === "compact"
            ? "12px"
            : uiScale === "large"
              ? "14px"
              : "13px",
      }}
      onKeyDown={handleKeyDown}
    >
      {/* 1. ICON RAIL (Fixed 52px width) */}
      <IconRail
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        themeMode={effectiveTheme}
      />

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
          {activeTab === "home" && (
            <HomeView
              setActiveTab={setActiveTab}
              playlist={playlist}
              biblesList={biblesList}
              displays={displays}
              isLive={isLive}
              currentSlide={currentSlide}
              nextSlide={nextSlide}
              handlePresentNow={handlePresentNow}
              handleStageNext={handleStageNext}
              themeMode={effectiveTheme}
            />
          )}

          {activeTab === "bible" && (
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

          {activeTab === "songs" && (
            <SongsView
              handleStageNext={handleStageNext}
              handlePresentNow={handlePresentNow}
              handleAddToPlaylist={handleAddToPlaylist}
              themeMode={effectiveTheme}
              defaultHymnCategory={defaultHymnCategory}
              showHymnNumbers={showHymnNumbers}
              hymnTextScale={hymnTextScale}
            />
          )}

          {activeTab === "plan" && (
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

          {activeTab === "settings" && (
            <SettingsView
              settingsSection={settingsSection}
              setSettingsSection={setSettingsSection}
              startupTab={startupTab}
              setStartupTab={setStartupTab}
              appInfo={appInfo}
              dbStatus={dbStatus}
              displays={displays}
              setDisplays={setDisplays}
              projectionDisplays={projectionDisplays}
              setProjectionDisplays={setProjectionDisplays}
              selectedTranslation={selectedTranslation}
              setSelectedTranslation={setSelectedTranslation}
              themeMode={themeMode}
              effectiveTheme={effectiveTheme}
              setThemeMode={setThemeMode}
              biblesList={biblesList}
              refreshBibles={refreshBibles}
              outputTheme={outputTheme}
              setOutputTheme={setOutputTheme}
              outputBgImage={outputBgImage}
              setOutputBgImage={setOutputBgImage}
              showVerseQuotes={showVerseQuotes}
              setShowVerseQuotes={setShowVerseQuotes}
              appNamePosition={appNamePosition}
              setAppNamePosition={setAppNamePosition}
              customHeaderTitle={customHeaderTitle}
              setCustomHeaderTitle={setCustomHeaderTitle}
              uiScale={uiScale}
              setUiScale={setUiScale}
              slideMargin={slideMargin}
              setSlideMargin={setSlideMargin}
              attributionPosition={attributionPosition}
              setAttributionPosition={setAttributionPosition}
              outputFontSize={outputFontSize}
              setOutputFontSize={setOutputFontSize}
              defaultHymnCategory={defaultHymnCategory}
              setDefaultHymnCategory={setDefaultHymnCategory}
              showHymnNumbers={showHymnNumbers}
              setShowHymnNumbers={setShowHymnNumbers}
              hymnTextScale={hymnTextScale}
              setHymnTextScale={setHymnTextScale}
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
        hymnDeckActive={isHymnDeckActive}
        presentNextDisabled={presentNextDisabled}
        presentPrevDisabled={presentPrevDisabled}
        handleTransportPrev={handleTransportPrev}
        handleTransportNext={handleTransportNext}
        handleTransportPresentNext={handleTransportPresentNext}
        handleToggleClear={handleToggleClear}
        handleToggleBlack={handleToggleBlack}
        handleTransportPresent={handleTransportPresent}
        handleTransportStop={handleTransportStop}
        themeMode={effectiveTheme}
        displays={displays}
        projectionDisplays={projectionDisplays}
        setProjectionDisplays={setProjectionDisplays}
        outputTheme={outputTheme}
        setOutputTheme={setOutputTheme}
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

      <Toaster
        position="top-center"
        theme={effectiveTheme === "light" ? "light" : "dark"}
        richColors
        closeButton
        offset={14}
        toastOptions={{
          style: {
            fontFamily: "'Plus Jakarta Sans', ui-sans-serif, sans-serif",
          },
        }}
      />
    </div>
  );
}
