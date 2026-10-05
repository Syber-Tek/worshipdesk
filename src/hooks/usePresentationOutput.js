import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * The presentation engine: everything that decides what is on the projector.
 *
 * This is deliberately the only place that builds a live-slide payload. A media
 * slide once worked in the planner but rendered as a filename on the projector,
 * because the individual present paths each rebuilt the payload by hand and
 * quietly dropped the media fields. One owner, one payload shape, one place to
 * look â€” see mediaOverrides below for the fields that must never be trimmed.
 *
 * State it owns (currentSlide, nextSlide, isLive, isBlack, isBlank, hymnDeck,
 * hymnDeckIndex) is returned so App can wire it into the rail and planner.
 */
export default function usePresentationOutput({
  playlist,
  setPlaylist,
  filteredVerses,
  selectedVerseIndex,
  setSelectedVerseIndex,
  selectedTranslation,
  getVerseWithSecondary,
  buildHymnDeck,
  outputTheme,
  outputBgImage,
  outputBgVideo,
  showVerseQuotes,
  appNamePosition,
  customHeaderTitle,
  slideMargin,
  attributionPosition,
  outputFontSize,
  hymnTextScale,
}) {
  const [currentSlide, setCurrentSlide] = useState(null);
  const [nextSlide, setNextSlide] = useState({});
  const [isLive, setIsLive] = useState(false);
  const [isBlack, setIsBlack] = useState(false);
  const [isBlank, setIsBlank] = useState(false);
  const [hymnDeck, setHymnDeck] = useState([]);
  const [hymnDeckIndex, setHymnDeckIndex] = useState(0);

  // A multi-page PDF is a deck of its own, stepped with the same Next/Prev the
  // operator already uses for verses and stanzas. mediaPage is the zero-based
  // page on air; pageCount is reported back from the window that loaded the PDF.
  // A hymn deck wins if one is active, because that is already the thing being
  // stepped through.
  const [mediaPage, setMediaPage] = useState(0);
  const [mediaPageCount, setMediaPageCount] = useState(0);

  // Bumped to restart the clip on air. The output window uses this as the
  // <video> React key, so changing it remounts the element and playback begins
  // again from zero. Cheaper than shipping play/pause/seek over IPC.
  const [mediaReplay, setMediaReplay] = useState(0);

  const handleReplayVideo = () => {
    setMediaReplay((n) => n + 1);
  };

  const isPagingPdf =
    currentSlide?.mediaType === "pdf" &&
    !(hymnDeck.length > 1 && currentSlide?.type === "Hymn");

  // Every field below must survive every trip through the payload. The media
  // fields are the fragile ones: drop them and the output window falls through
  // to the text renderer, which draws the slide title as a bottom attribution
  // line, so a photo silently becomes a filename.
  const mediaOverrides = (slide) => ({
    mediaType: slide?.mediaType || null,
    mediaName: slide?.mediaName || null,
    mediaFit: slide?.mediaFit || "contain",
    mediaMuted: slide?.mediaMuted !== false,
  });

  const normalizeSlide = (item) => {
    if (!item || typeof item !== "object") return null;
    const isVerse = !!(item.ref || item.book || item.type === "Bible Verse");
    const refTitle = item.ref ? item.ref : "";
    const title = item.title || refTitle || "Untitled Slide";
    const content =
      item.content || item.text || item.lyrics || item.verse_text || "";
    const type = item.type || (isVerse ? "Bible Verse" : "Custom Slide");
    return {
      title,
      content,
      secondaryText: item.secondaryText || "",
      secondaryTranslation: item.secondaryTranslation || "",
      type,
      hymn_number: item.hymn_number,
      category: item.category,
      mediaType: item.mediaType || null,
      mediaName: item.mediaName || null,
      mediaFit: item.mediaFit || "contain",
      mediaMuted: item.mediaMuted !== false,
    };
  };

  const broadcastToPresentation = useCallback(
    (overrides = {}) => {
      if (window.api && window.api.sendLiveSlide) {
        const isVerseDeck =
          (currentSlide?.type || "Bible Verse") === "Bible Verse";
        const isHymnDeckActive = !isVerseDeck && hymnDeck.length > 1;

        let nextSlideTitle = "";
        let nextSlideContent = "";

        if (isVerseDeck && Array.isArray(filteredVerses)) {
          const nextVerse = filteredVerses[selectedVerseIndex + 1];
          if (nextVerse) {
            nextSlideTitle = nextVerse.ref || `Verse ${selectedVerseIndex + 2}`;
            nextSlideContent = nextVerse.text || "";
          }
        } else if (isHymnDeckActive && Array.isArray(hymnDeck)) {
          const nextHymnSlide = hymnDeck[hymnDeckIndex + 1];
          if (nextHymnSlide) {
            nextSlideTitle = nextHymnSlide.hymnLabel
              ? `${nextHymnSlide.hymnLabel} â€” ${nextHymnSlide.title}`
              : nextHymnSlide.title;
            nextSlideContent = nextHymnSlide.content || "";
          }
        }

        // A media slide's title IS its filename. Showing it puts a file name in
        // the header and the bottom attribution bar, which is never what an
        // operator wants on air, so media slides send no title at all.
        const isMediaSlide = !!currentSlide?.mediaName;

        window.api.sendLiveSlide({
          title: isMediaSlide
            ? ""
            : currentSlide?.title || currentSlide?.ref || "",
          content: currentSlide?.content || currentSlide?.text || "",
          secondaryText: currentSlide?.secondaryText || "",
          secondaryTranslation: currentSlide?.secondaryTranslation || "",
          type: currentSlide?.type || "Bible Verse",
          hymnLabel: currentSlide?.hymnLabel || "",
          nextSlideTitle,
          nextSlideContent,
          isLive,
          isBlank,
          isBlack,
          outputTheme,
          outputBgImage,
          outputBgVideo,
          showVerseQuotes,
          appNamePosition,
          customHeaderTitle,
          slideMargin,
          attributionPosition,
          outputFontSize,
          hymnTextScale,
          // mediaName is a stored filename, not a path. The output window
          // resolves it to a file:// URL via IPC so path logic stays in main.
          ...mediaOverrides(currentSlide),
          mediaPage,
          mediaReplay,
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
      outputBgVideo,
      showVerseQuotes,
      appNamePosition,
      customHeaderTitle,
      slideMargin,
      attributionPosition,
      outputFontSize,
      hymnTextScale,
      selectedVerseIndex,
      filteredVerses.length,
      hymnDeck,
      hymnDeckIndex,
      mediaPage,
      mediaReplay,
    ],
  );

  // Re-broadcast on every change so the projector always mirrors app state,
  // including after a transport action that mutates state without an explicit
  // payload of its own.
  useEffect(() => {
    broadcastToPresentation();
  }, [broadcastToPresentation]);

  const markStatus = (id, status) => {
    setPlaylist((prev) =>
      prev.map((i) => {
        if (i.id === id) return { ...i, status };
        if (i.status === status) return { ...i, status: "pending" };
        return i;
      }),
    );
  };

  // Stage an item as "Next" without going on air. The media fields must be
  // carried here too, otherwise the rail's Next Staged preview has nothing to
  // show and silently renders no thumbnail at all.
  const handleSelectItem = (item) => {
    setNextSlide({
      id: item.id,
      title: item.title,
      content: item.content,
      secondaryText: item.secondaryText || "",
      secondaryTranslation: item.secondaryTranslation || "",
      type: item.type,
      ...mediaOverrides(item),
    });
    markStatus(item.id, "next");
    toast.info(`Staged "${item.title || "item"}" as Next`);
  };

  const handleStageNext = (item) => {
    const slide = normalizeSlide(item);
    if (!slide) return;
    setNextSlide({ id: `item-${Date.now()}`, ...slide });
    toast.info(`Staged "${slide.title || "item"}" as Next`);
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
        ...mediaOverrides(item),
      };
    }
    setCurrentSlide(updatedSlide);
    setMediaPage(0);
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
      ...mediaOverrides(item),
    });

    markStatus(item.id, "live");
    toast.success(`Broadcasting "${updatedSlide.title || "slide"}" Live`);
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
        title: item.ref ? item.ref : item.title || "",
        content: item.content || item.text || "",
        secondaryText: item.secondaryText || "",
        secondaryTranslation: item.secondaryTranslation || "",
        type: item.type || "Bible Verse",
        ...mediaOverrides(item),
      };
    }
    setCurrentSlide(updated);
    setMediaPage(0);
    setIsLive(true);
    setIsBlack(false);
    setIsBlank(false);

    broadcastToPresentation({
      title: updated.title,
      content: updated.content,
      secondaryText: updated.secondaryText,
      secondaryTranslation: updated.secondaryTranslation,
      type: updated.type,
      isLive: true,
      isBlack: false,
      isBlank: false,
      ...mediaOverrides(item),
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
      setMediaPage(0);
      setIsLive(true);
      setIsBlack(false);
      setIsBlank(false);

      broadcastToPresentation({
        title: toPresent.title,
        content: toPresent.content,
        secondaryText: toPresent.secondaryText || "",
        secondaryTranslation: toPresent.secondaryTranslation || "",
        type: toPresent.type,
        isLive: true,
        isBlack: false,
        isBlank: false,
        ...mediaOverrides(toPresent),
      });
      toast.success(`Broadcasting "${toPresent.title || "slide"}" Live`);
    }
  };

  const handleTransportStop = () => {
    setIsLive(false);
    broadcastToPresentation({ isLive: false });
    toast.info("Presentation output in Standby mode");
  };

  const handleToggleBlack = () => {
    const nextState = !isBlack;
    setIsBlack(nextState);
    broadcastToPresentation({ isBlack: nextState });
    if (nextState) {
      toast.warning("Blackout screen active");
    } else {
      toast.info("Blackout screen off");
    }
  };

  const handleToggleClear = () => {
    setCurrentSlide({});
    setMediaPage(0);
    setNextSlide({});
    setHymnDeck([]);
    setHymnDeckIndex(0);
    setIsLive(true);
    setIsBlack(false);
    setIsBlank(true);

    broadcastToPresentation({
      title: "",
      content: "",
      secondaryText: "",
      secondaryTranslation: "",
      nextSlideTitle: "",
      nextSlideContent: "",
      type: "Bible Verse",
      isLive: true,
      isBlack: false,
      isBlank: true,
    });
    toast.info("Live output and staged next slide cleared");
  };

  const handleTransportPrev = () => {
    if (isPagingPdf) {
      if (mediaPage > 0) setMediaPage(mediaPage - 1);
      return;
    }
    if (selectedVerseIndex > 0) {
      const prevVerse = filteredVerses[selectedVerseIndex - 1];
      setSelectedVerseIndex(selectedVerseIndex - 1);
      setNextSlide({
        id: `verse-${prevVerse.id}`,
        title: `${prevVerse.ref} (${selectedTranslation})`,
        content: prevVerse.text,
        type: "Bible Verse",
      });
      toast.info(`Staged ${prevVerse.ref || "verse"} as Next`);
    }
  };

  const handleTransportNext = () => {
    if (isPagingPdf) {
      if (mediaPage < mediaPageCount - 1) setMediaPage(mediaPage + 1);
      return;
    }
    if (selectedVerseIndex < filteredVerses.length - 1) {
      const nextV = filteredVerses[selectedVerseIndex + 1];
      setSelectedVerseIndex(selectedVerseIndex + 1);
      setNextSlide({
        id: `verse-${nextV.id}`,
        title: `${nextV.ref} (${selectedTranslation})`,
        content: nextV.text,
        type: "Bible Verse",
      });
      toast.info(`Staged ${nextV.ref || "verse"} as Next`);
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
        setMediaPage(0);
        setIsLive(true);
        setIsBlack(false);
        setIsBlank(false);
        broadcastToPresentation({
          ...slide,
          isLive: true,
          isBlack: false,
          isBlank: false,
        });
        toast.success(`Broadcasting "${slide.title || "slide"}" Live`);
      }
    } else if (selectedVerseIndex < filteredVerses.length - 1) {
      const nextV = getVerseWithSecondary(filteredVerses[selectedVerseIndex + 1]);
      const updated = {
        id: `verse-${nextV.id}`,
        title: nextV.ref || `${nextV.ref} (${selectedTranslation})`,
        content: nextV.text,
        secondaryText: nextV.secondaryText || "",
        secondaryTranslation: nextV.secondaryTranslation || "",
        type: "Bible Verse",
      };
      setSelectedVerseIndex(selectedVerseIndex + 1);
      setNextSlide(updated);
      setCurrentSlide(updated);
      setMediaPage(0);
      setIsLive(true);
      setIsBlack(false);
      setIsBlank(false);

      broadcastToPresentation({
        ...updated,
        isLive: true,
        isBlack: false,
        isBlank: false,
      });
      toast.success(`Broadcasting "${updated.title || "slide"}" Live`);
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
        setMediaPage(0);
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
      const prevV = getVerseWithSecondary(filteredVerses[selectedVerseIndex - 1]);
      const updated = {
        id: `verse-${prevV.id}`,
        title: prevV.ref || `${prevV.ref} (${selectedTranslation})`,
        content: prevV.text,
        secondaryText: prevV.secondaryText || "",
        secondaryTranslation: prevV.secondaryTranslation || "",
        type: "Bible Verse",
      };
      setSelectedVerseIndex(selectedVerseIndex - 1);
      setNextSlide(updated);
      setCurrentSlide(updated);
      setMediaPage(0);
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

  return {
    currentSlide,
    nextSlide,
    isLive,
    isBlack,
    isBlank,
    hymnDeck,
    hymnDeckIndex,
    setCurrentSlide,
    setNextSlide,
    setIsLive,
    setIsBlack,
    setIsBlank,
    setHymnDeck,
    setHymnDeckIndex,
    normalizeSlide,
    mediaOverrides,
    mediaPage,
    mediaPageCount,
    setMediaPageCount,
    isPagingPdf,
    mediaReplay,
    handleReplayVideo,
    handleSelectItem,
    handleStageNext,
    handlePresentItemNow,
    handlePresentNow,
    handleTransportPresent,
    handleTransportStop,
    handleToggleBlack,
    handleToggleClear,
    handleTransportPrev,
    handleTransportNext,
    handleTransportPresentNext,
    handleTransportPresentPrev,
  };
}
