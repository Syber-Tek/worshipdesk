import React, { useEffect, useState } from "react";
import { resolveBackground, resolveVideo } from "./outputBackgrounds";
import MediaSlide from "./MediaSlide";

// Which window am I, and am I allowed to make noise? Set by the main process when
// the window is created: the stage display is always silent, and exactly one
// projector window is the audio owner.
const params = new URLSearchParams(window.location.search);
const WINDOW_ROLE = params.get("window") || "control";
const IS_AUDIO_OWNER = params.get("audio") === "1";

export default function PresentationOutputWindow() {
  const [slideData, setSlideData] = useState({});
  // A media slide stores only a filename. The main process turns it into a
  // file:// URL and reports whether the file is still there, so a moved or
  // deleted file produces a clear message instead of a black screen.
  const [media, setMedia] = useState({ url: null, exists: false });

  useEffect(() => {
    const name = slideData.mediaName;
    if (!name || !window.api || !window.api.resolveMediaUrls) {
      setMedia({ url: null, exists: false });
      return;
    }
    let cancelled = false;
    window.api.resolveMediaUrls([name]).then((map) => {
      if (cancelled) return;
      setMedia(map?.[name] || { url: null, exists: false });
    });
    return () => {
      cancelled = true;
    };
  }, [slideData.mediaName]);

  useEffect(() => {
    if (window.api && window.api.onPresentationUpdate) {
      const unsubscribe = window.api.onPresentationUpdate((data) => {
        setSlideData((prev) => ({ ...prev, ...data }));
      });
      return unsubscribe;
    }
  }, []);

  // Arrow keys / space on the projector window move through the verse deck.
  useEffect(() => {
    const onKey = (e) => {
      if (!window.api || !window.api.sendDeckNav) return;
      if (
        ["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(e.key)
      ) {
        e.preventDefault();
        window.api.sendDeckNav("next");
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        window.api.sendDeckNav("prev");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Explicit Black Screen Override Mode
  if (slideData.isBlack) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center select-none" />
    );
  }

  // Standby Display Mode (When not live on air)
  if (!slideData.isLive) {
    return (
      <div className="h-screen w-screen bg-bg text-text-primary flex flex-col items-center justify-center select-none font-sans p-8 border-4 border-border">
        <div className="flex flex-col items-center gap-3 opacity-70">
          <h2 className="text-xl font-bold tracking-widest text-text-primary uppercase">
            WorshipDesk
          </h2>
          <div className="px-3 py-1 rounded bg-raised border border-border text-[11px] font-semibold text-accent flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            PROJECTOR DISPLAY READY — STANDBY MODE
          </div>
          <p className="text-xs text-muted max-w-md text-center mt-1 leading-relaxed">
            Click <span className="text-accent font-bold">"Present"</span> or
            toggle{" "}
            <span className="text-live font-bold">"LIVE ON-AIR"</span> in
            the main control window to project scriptures and hymns.
          </p>
        </div>
      </div>
    );
  }

  // A media slide IS the slide: the picked file fills the screen, and the
  // app-wide output theme (dark/light/image/video) does not apply to it.
  if (slideData.mediaName) {
    if (!media.url) {
      return (
        <div className="h-screen w-screen bg-black flex flex-col items-center justify-center gap-3 text-white select-none font-sans p-8">
          <div className="text-xl font-bold tracking-widest uppercase text-red-400">
            Media File Not Found
          </div>
          <p className="text-sm text-white/70 text-center max-w-lg leading-relaxed">
            {slideData.title || slideData.mediaName}
          </p>
          <p className="text-xs text-white/50 text-center max-w-lg leading-relaxed">
            The file is no longer where WorshipDesk stored it. Close the planner
            item's menu and choose Relink to point it at the file again.
          </p>
        </div>
      );
    }

    return (
      <div className="h-screen w-screen bg-black relative overflow-hidden select-none">
        <MediaSlide
          type={slideData.mediaType}
          url={media.url}
          fit={slideData.mediaFit}
          allowAudio={IS_AUDIO_OWNER && slideData.mediaMuted === false}
          label={slideData.title}
          page={slideData.mediaPage || 0}
          replayKey={slideData.mediaReplay || 0}
        />
      </div>
    );
  }

  const theme = slideData.outputTheme || "dark";
  const isLight = theme === "light";
  const isImage = theme === "image";
  const isVideo = theme === "video";
  const bgImg = resolveBackground(slideData.outputBgImage || "dark-horizon");
  const bgVideo = resolveVideo(slideData.outputBgVideo || "galaxy-stars");

  const isHymn = slideData.type === "Hymn";
  // Quotes only make sense around scripture verses, never around hymns/sermons.
  const showQuotes =
    slideData.type !== "Hymn" && slideData.showVerseQuotes !== false;
  const content = slideData.content ?? "";
  const displayContent = showQuotes ? `"${content}"` : content;

  // Hymn lyrics have their own scale in Settings > Songs, so a slide follows the
  // scale that actually belongs to its kind instead of one global size.
  const fontScale = isHymn
    ? slideData.hymnTextScale || slideData.outputFontSize || "normal"
    : slideData.outputFontSize || "normal";
  const verseSizes = {
    small: "text-2xl md:text-4xl",
    normal: "text-3xl md:text-5xl",
    large: "text-4xl md:text-6xl",
    xlarge: "text-5xl md:text-7xl",
    xxlarge: "text-6xl md:text-8xl",
  };
  const hymnSizes = {
    small: "text-xl md:text-3xl",
    normal: "text-2xl md:text-4xl",
    large: "text-3xl md:text-5xl",
    xlarge: "text-4xl md:text-6xl",
    xxlarge: "text-5xl md:text-7xl",
  };
  const dualVerseSizes = {
    small: "text-xl md:text-3xl",
    normal: "text-2xl md:text-4xl",
    large: "text-3xl md:text-5xl",
    xlarge: "text-4xl md:text-6xl",
    xxlarge: "text-5xl md:text-7xl",
  };
  const dualHymnSizes = {
    small: "text-lg md:text-2xl",
    normal: "text-xl md:text-3xl",
    large: "text-2xl md:text-4xl",
    xlarge: "text-3xl md:text-5xl",
    xxlarge: "text-4xl md:text-6xl",
  };
  const attributionSizes = {
    small: "text-base md:text-lg",
    normal: "text-xl md:text-2xl",
    large: "text-2xl md:text-3xl",
    xlarge: "text-3xl md:text-4xl",
    xxlarge: "text-4xl md:text-5xl",
  };
  const attributionTopSizes = {
    small: "text-xs",
    normal: "text-sm",
    large: "text-base",
    xlarge: "text-xl",
    xxlarge: "text-2xl",
  };
  const bodyClasses = isHymn
    ? `whitespace-pre-line ${hymnSizes[fontScale] || hymnSizes.normal} font-normal leading-normal tracking-normal`
    : `whitespace-pre-line ${verseSizes[fontScale] || verseSizes.normal} font-bold leading-relaxed tracking-wide`;

  const dualBodyClasses = isHymn
    ? `whitespace-pre-line ${dualHymnSizes[fontScale] || dualHymnSizes.normal} font-normal leading-relaxed`
    : `whitespace-pre-line ${dualVerseSizes[fontScale] || dualVerseSizes.normal} font-bold leading-relaxed`;

  const marginClass =
    slideData.slideMargin === "2rem"
      ? "p-8"
      : slideData.slideMargin === "6rem"
        ? "p-24"
        : "p-16";

  const attributionPos = slideData.attributionPosition || "bottom";
  const attributionNode =
    !slideData.isBlank && slideData.title ? (
      <h2
        className={`font-bold tracking-wider uppercase text-center w-full ${
          isImage ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" : ""
        } ${attributionPos === "top" ? attributionTopSizes[fontScale] || attributionTopSizes.normal : attributionSizes[fontScale] || attributionSizes.normal}`}
      >
        — {slideData.title} —
      </h2>
    ) : null;

  const deckChip =
    slideData.deckTotal > 0 ? (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-current/10 opacity-90">
        {slideData.deckPosition} / {slideData.deckTotal}
      </span>
    ) : null;
  const brandText = slideData.customHeaderTitle || "WorshipDesk";
  const appNamePos = slideData.appNamePosition || "top-left";

  const slideTypeNode = slideData.isBlank ? null : (
    <span className="flex items-center gap-2">
      {slideData.hymnLabel || slideData.type}
      {deckChip}
    </span>
  );

  let headerLeft = null;
  let headerRight = null;

  if (appNamePos === "top-left") {
    headerLeft = <span>{brandText}</span>;
    headerRight = slideTypeNode;
  } else if (appNamePos === "top-right") {
    headerLeft = slideTypeNode;
    headerRight = <span>{brandText}</span>;
  } else {
    headerLeft = slideTypeNode;
    headerRight = null;
  }

  const footerLeft =
    appNamePos === "bottom-left" ? (
      <span className="text-xs font-semibold tracking-wider uppercase">
        {brandText}
      </span>
    ) : null;
  const footerRight =
    appNamePos === "bottom-right" ? (
      <span className="text-xs font-semibold tracking-wider uppercase">
        {brandText}
      </span>
    ) : null;

  if (isImage || isVideo) {
    return (
      <div
        className={`h-screen w-screen relative flex flex-col justify-between ${marginClass} select-none overflow-hidden font-sans bg-cover bg-center bg-no-repeat`}
        style={isImage ? { backgroundImage: `url("${bgImg}")` } : {}}
      >
        {isVideo && (
          <video
            src={bgVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top Header Label (title shown here when attribution is 'top') */}
          <div className="flex items-center justify-between gap-4 text-sm font-semibold tracking-widest text-accent uppercase border-b border-white/20 pb-4 drop-shadow">
            <div className="flex-1">{headerLeft}</div>
            {attributionPos === "top" ? (
              <div className="text-center">{attributionNode}</div>
            ) : null}
            <div className="flex-1 flex justify-end">{headerRight}</div>
          </div>

          {/* Main Centered Text Block */}
          {!slideData.isBlank && (
            <div className="my-auto max-w-7xl mx-auto w-full px-4">
              {slideData.secondaryText ? (
                <div className="grid grid-cols-2 divide-x divide-white/20 items-stretch">
                  {/* Primary Translation */}
                  <div className="flex flex-col justify-center text-center space-y-3 pr-8 md:pr-12">
                    <p className={`${dualBodyClasses} text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]`}>
                      {displayContent}
                    </p>
                  </div>

                  {/* Secondary Parallel Translation */}
                  <div className="flex flex-col justify-center text-center space-y-3 pl-8 md:pl-12">
                    <p className={`${dualBodyClasses} text-accent/95 italic font-medium drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]`}>
                      {showQuotes ? `"${slideData.secondaryText}"` : slideData.secondaryText}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className={`${bodyClasses} text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]`}>
                    {displayContent}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reference / Attribution Line Below & Footer App Name */}
          {attributionPos !== "top" && (
            <div className="relative flex items-center pt-6 border-t border-white/20 text-accent">
              <div
                className={`absolute left-0 drop-shadow ${attributionPos === "bottom-right" ? "invisible" : ""}`}
              >
                {footerLeft}
              </div>
              <div
                className={`w-full ${attributionPos === "bottom-right" ? "text-right" : "text-center"}`}
              >
                {attributionNode}
              </div>
              <div className="absolute right-0 drop-shadow">{footerRight}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isLight) {
    return (
      <div
        className={`h-screen w-screen bg-[#FFFFFF] text-[#111827] flex flex-col justify-between ${marginClass} select-none overflow-hidden font-sans`}
      >
        {/* Top Header Label */}
        <div className="flex items-center justify-between gap-4 text-sm font-semibold tracking-widest text-[#B4821E] uppercase border-b border-[#E5E7EB] pb-4">
          <div className="flex-1">{headerLeft}</div>
          {attributionPos === "top" ? (
            <div className="text-center">{attributionNode}</div>
          ) : null}
          <div className="flex-1 flex justify-end">{headerRight}</div>
        </div>

        {/* Main Centered Text Block */}
        {!slideData.isBlank && (
          <div className="my-auto max-w-7xl mx-auto w-full px-4">
            {slideData.secondaryText ? (
              <div className="grid grid-cols-2 divide-x divide-[#E5E7EB] items-stretch">
                {/* Primary Translation */}
                <div className="flex flex-col justify-center text-center space-y-3 pr-8 md:pr-12">
                  <p className={`${dualBodyClasses} text-[#111827]`}>
                    {displayContent}
                  </p>
                </div>

                {/* Secondary Parallel Translation */}
                <div className="flex flex-col justify-center text-center space-y-3 pl-8 md:pl-12">
                  <p className={`${dualBodyClasses} text-[#B4821E] italic font-medium`}>
                    {showQuotes ? `"${slideData.secondaryText}"` : slideData.secondaryText}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className={`${bodyClasses} text-[#111827]`}>{displayContent}</p>
              </div>
            )}
          </div>
        )}

        {/* Reference / Attribution Line Below & Footer App Name */}
        {attributionPos !== "top" && (
          <div className="relative flex items-center pt-6 border-t border-[#E5E7EB] text-[#B4821E]">
            <div
              className={`absolute left-0 ${attributionPos === "bottom-right" ? "invisible" : ""}`}
            >
              {footerLeft}
            </div>
            <div
              className={`w-full ${attributionPos === "bottom-right" ? "text-right" : "text-center"}`}
            >
              {attributionNode}
            </div>
            <div className="absolute right-0">{footerRight}</div>
          </div>
        )}
      </div>
    );
  }

  // Dark Theme (Default)
  return (
    <div
      className={`h-screen w-screen bg-bg text-text-primary flex flex-col justify-between ${marginClass} select-none overflow-hidden font-sans`}
    >
      {/* Top Header Label */}
      <div className="flex items-center justify-between gap-4 text-sm font-semibold tracking-widest text-accent uppercase border-b border-[#2A2C31]/40 pb-4">
        <div className="flex-1">{headerLeft}</div>
        {attributionPos === "top" ? (
          <div className="text-center">{attributionNode}</div>
        ) : null}
        <div className="flex-1 flex justify-end">{headerRight}</div>
      </div>

      {/* Main Centered Text Block */}
      {!slideData.isBlank && (
        <div className="my-auto max-w-7xl mx-auto w-full px-4">
          {slideData.secondaryText ? (
            <div className="grid grid-cols-2 divide-x divide-[#2A2C31]/40 items-stretch">
              {/* Primary Translation */}
              <div className="flex flex-col justify-center text-center space-y-3 pr-8 md:pr-12">
                <p className={`${dualBodyClasses} text-text-primary`}>
                  {displayContent}
                </p>
              </div>

              {/* Secondary Parallel Translation */}
              <div className="flex flex-col justify-center text-center space-y-3 pl-8 md:pl-12">
                <p className={`${dualBodyClasses} text-accent italic font-medium`}>
                  {showQuotes ? `"${slideData.secondaryText}"` : slideData.secondaryText}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className={`${bodyClasses} text-text-primary`}>{displayContent}</p>
            </div>
          )}
        </div>
      )}

      {/* Reference / Attribution Line Below & Footer App Name */}
      {attributionPos !== "top" && (
        <div className="relative flex items-center pt-6 border-t border-[#2A2C31]/40 text-accent">
          <div
            className={`absolute left-0 ${attributionPos === "bottom-right" ? "invisible" : ""}`}
          >
            {footerLeft}
          </div>
          <div
            className={`w-full ${attributionPos === "bottom-right" ? "text-right" : "text-center"}`}
          >
            {attributionNode}
          </div>
          <div className="absolute right-0">{footerRight}</div>
        </div>
      )}
    </div>
  );
}
