import React, { useEffect, useState } from "react";

export default function PresentationOutputWindow() {
  const [slideData, setSlideData] = useState({
    title: "John 3:16 (KJV)",
    content:
      "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    type: "Bible Verse",
    isLive: false,
    isBlank: false,
    isBlack: false,
    outputTheme: "dark", // 'dark' | 'light' | 'image'
    outputBgImage: "",
    showVerseQuotes: true,
  });

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
          <div className="px-3 py-1 rounded bg-[#24262B] border border-[#2A2C31] text-[11px] font-semibold text-accent flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            PROJECTOR DISPLAY READY — STANDBY MODE
          </div>
          <p className="text-xs text-[#9B9CA3] max-w-md text-center mt-1 leading-relaxed">
            Click <span className="text-accent font-bold">"Present"</span> or
            toggle <span className="text-live font-bold">"LIVE ON-AIR"</span> in
            the main control window to project scriptures and hymns.
          </p>
        </div>
      </div>
    );
  }

  const theme = slideData.outputTheme || "dark";
  const isLight = theme === "light";
  const isImage = theme === "image";
  const bgImg =
    slideData.outputBgImage ||
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1600&auto=format&fit=crop";

  const isHymn = slideData.type === "Hymn";
  const showQuotes =
    slideData.type !== "Hymn" && slideData.showVerseQuotes !== false;
  const content = slideData.content ?? "";
  const displayContent = showQuotes ? `"${content}"` : content;

  // Font Sizing logic based on presentationFontSize
  const presFontSize = slideData.presentationFontSize || "normal";
  let bodyClasses = "";
  let attrClasses = "";

  if (isHymn) {
    if (presFontSize === "compact") {
      bodyClasses =
        "whitespace-pre-line text-lg md:text-2xl font-normal leading-normal tracking-normal";
      attrClasses =
        "text-base md:text-lg font-bold tracking-wider uppercase";
    } else if (presFontSize === "large") {
      bodyClasses =
        "whitespace-pre-line text-3xl md:text-5xl font-normal leading-relaxed tracking-normal";
      attrClasses =
        "text-2xl md:text-3xl font-bold tracking-wider uppercase";
    } else if (presFontSize === "xlarge") {
      bodyClasses =
        "whitespace-pre-line text-4xl md:text-6xl font-normal leading-relaxed tracking-normal";
      attrClasses =
        "text-3xl md:text-4xl font-bold tracking-wider uppercase";
    } else {
      bodyClasses =
        "whitespace-pre-line text-2xl md:text-4xl font-normal leading-normal tracking-normal";
      attrClasses =
        "text-xl md:text-2xl font-bold tracking-wider uppercase";
    }
  } else {
    if (presFontSize === "compact") {
      bodyClasses =
        "whitespace-pre-line text-2xl md:text-4xl font-bold leading-relaxed tracking-wide";
      attrClasses =
        "text-base md:text-lg font-bold tracking-wider uppercase";
    } else if (presFontSize === "large") {
      bodyClasses =
        "whitespace-pre-line text-4xl md:text-6xl font-bold leading-relaxed tracking-wide";
      attrClasses =
        "text-2xl md:text-3xl font-bold tracking-wider uppercase";
    } else if (presFontSize === "xlarge") {
      bodyClasses =
        "whitespace-pre-line text-5xl md:text-7xl font-bold leading-relaxed tracking-wide";
      attrClasses =
        "text-3xl md:text-4xl font-bold tracking-wider uppercase";
    } else {
      bodyClasses =
        "whitespace-pre-line text-3xl md:text-5xl font-bold leading-relaxed tracking-wide";
      attrClasses =
        "text-xl md:text-2xl font-bold tracking-wider uppercase";
    }
  }

  const marginSetting = slideData.slideMargin || "4rem";
  const paddingClass =
    marginSetting === "2rem"
      ? "p-8"
      : marginSetting === "6rem"
        ? "p-24"
        : "p-16";

  const deckChip =
    slideData.deckTotal > 0 ? (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-current/10 opacity-90">
        {slideData.deckPosition} / {slideData.deckTotal}
      </span>
    ) : null;
  const brandText = slideData.customHeaderTitle || "WorshipDesk";
  const appNamePos = slideData.appNamePosition || "top-left";
  const attrPos = slideData.attributionPos || "bottom";

  const slideTypeNode = slideData.isBlank ? null : (
    <span className="flex items-center gap-2">
      {slideData.type}
      {deckChip}
    </span>
  );

  const attributionTitleNode =
    !slideData.isBlank && slideData.title ? (
      <h2 className={attrClasses}>— {slideData.title} —</h2>
    ) : null;

  let headerLeftNode = null;
  let headerCenterNode = null;
  let headerRightNode = null;

  if (appNamePos === "top-left") {
    headerLeftNode = <span>{brandText}</span>;
    if (attrPos === "top") {
      headerCenterNode = attributionTitleNode;
      headerRightNode = slideTypeNode;
    } else {
      headerRightNode = slideTypeNode;
    }
  } else if (appNamePos === "top-right") {
    if (attrPos === "top") {
      headerLeftNode = slideTypeNode;
      headerCenterNode = attributionTitleNode;
      headerRightNode = <span>{brandText}</span>;
    } else {
      headerLeftNode = slideTypeNode;
      headerRightNode = <span>{brandText}</span>;
    }
  } else {
    headerLeftNode = slideTypeNode;
    if (attrPos === "top") {
      headerCenterNode = attributionTitleNode;
    }
  }

  const footerLeftNode =
    appNamePos === "bottom-left" ? (
      <span className="text-xs font-semibold tracking-wider uppercase">
        {brandText}
      </span>
    ) : null;

  const footerCenterNode =
    attrPos === "bottom" ? attributionTitleNode : null;

  const footerRightNode =
    attrPos === "bottom-right" ? (
      attributionTitleNode
    ) : appNamePos === "bottom-right" ? (
      <span className="text-xs font-semibold tracking-wider uppercase">
        {brandText}
      </span>
    ) : null;

  if (isImage) {
    return (
      <div
        className={`h-screen w-screen relative flex flex-col justify-between ${paddingClass} select-none overflow-hidden font-sans bg-cover bg-center bg-no-repeat`}
        style={{ backgroundImage: `url("${bgImg}")` }}
      >
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top Header Label */}
          <div className="flex justify-between items-center text-sm font-semibold tracking-widest text-accent uppercase border-b border-white/20 pb-4 drop-shadow">
            <div className="w-1/3 text-left">{headerLeftNode}</div>
            <div className="w-1/3 text-center">{headerCenterNode}</div>
            <div className="w-1/3 text-right flex justify-end">{headerRightNode}</div>
          </div>

          {/* Main Centered Text Block */}
          {!slideData.isBlank && (
            <div className="my-auto max-w-5xl mx-auto text-center px-8">
              <p
                className={`${bodyClasses} text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]`}
              >
                {displayContent}
              </p>
            </div>
          )}

          {/* Reference / Attribution Line Below & Footer App Name */}
          <div className="flex items-center justify-between pt-6 border-t border-white/20 text-accent">
            <div className="w-1/3 text-left drop-shadow">{footerLeftNode}</div>
            <div className="w-1/3 text-center drop-shadow">{footerCenterNode}</div>
            <div className="w-1/3 text-right drop-shadow flex justify-end">{footerRightNode}</div>
          </div>
        </div>
      </div>
    );
  }

  if (isLight) {
    return (
      <div className={`h-screen w-screen bg-[#FFFFFF] text-[#111827] flex flex-col justify-between ${paddingClass} select-none overflow-hidden font-sans`}>
        {/* Top Header Label */}
        <div className="flex justify-between items-center text-sm font-semibold tracking-widest text-[#B4821E] uppercase border-b border-[#E5E7EB] pb-4">
          <div className="w-1/3 text-left">{headerLeftNode}</div>
          <div className="w-1/3 text-center">{headerCenterNode}</div>
          <div className="w-1/3 text-right flex justify-end">{headerRightNode}</div>
        </div>

        {/* Main Centered Text Block */}
        {!slideData.isBlank && (
          <div className="my-auto max-w-5xl mx-auto text-center px-8">
            <p className={`${bodyClasses} text-[#111827]`}>{displayContent}</p>
          </div>
        )}

        {/* Reference / Attribution Line Below & Footer App Name */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E5E7EB] text-[#B4821E]">
          <div className="w-1/3 text-left">{footerLeftNode}</div>
          <div className="w-1/3 text-center">{footerCenterNode}</div>
          <div className="w-1/3 text-right flex justify-end">{footerRightNode}</div>
        </div>
      </div>
    );
  }

  // Dark Theme (Default)
  return (
    <div className={`h-screen w-screen bg-bg text-text-primary flex flex-col justify-between ${paddingClass} select-none overflow-hidden font-sans`}>
      {/* Top Header Label */}
      <div className="flex justify-between items-center text-sm font-semibold tracking-widest text-accent uppercase border-b border-[#2A2C31]/40 pb-4">
        <div className="w-1/3 text-left">{headerLeftNode}</div>
        <div className="w-1/3 text-center">{headerCenterNode}</div>
        <div className="w-1/3 text-right flex justify-end">{headerRightNode}</div>
      </div>

      {/* Main Centered Text Block */}
      {!slideData.isBlank && (
        <div className="my-auto max-w-5xl mx-auto text-center px-8">
          <p className={`${bodyClasses} text-text-primary`}>{displayContent}</p>
        </div>
      )}

      {/* Reference / Attribution Line Below & Footer App Name */}
      <div className="flex items-center justify-between pt-6 border-t border-[#2A2C31]/40 text-accent">
        <div className="w-1/3 text-left">{footerLeftNode}</div>
        <div className="w-1/3 text-center">{footerCenterNode}</div>
        <div className="w-1/3 text-right flex justify-end">{footerRightNode}</div>
      </div>
    </div>
  );
}
