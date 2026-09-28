import React from "react";
import { FaTv, FaFilm } from "react-icons/fa6";
import {
  resolveBackground,
  resolveVideo,
  OUTPUT_BACKGROUNDS,
  OUTPUT_VIDEOS,
} from "../../outputBackgrounds";

export default function PresentationSettings({
  outputTheme,
  setOutputTheme,
  outputBgImage,
  setOutputBgImage,
  outputBgVideo,
  setOutputBgVideo,
  appNamePosition = "top-left",
  setAppNamePosition,
  customHeaderTitle = "WorshipDesk",
  setCustomHeaderTitle,
  slideMargin = "4rem",
  setSlideMargin,
  attributionPosition = "bottom",
  setAttributionPosition,
  outputFontSize = "normal",
  setOutputFontSize,
  showVerseQuotes = true,
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-accent flex items-center gap-2">
          <FaTv /> Presentation Output &amp; Slide Themes
        </h3>
        <p className="text-xs mt-1 text-text-secondary">
          Configure Projector typography, background theme (Dark, Light, Custom
          Image, or Motion Video), and presentation overlays.
        </p>
      </div>

      <div className="space-y-4 pt-2 border-t border-border">
        {/* Output Theme Selection */}
        <div className="p-4 rounded border border-border bg-surface space-y-3">
          <div>
            <div className="font-semibold text-xs text-text-primary">
              Output Display Background Theme
            </div>
            <div className="text-[11px] text-text-secondary">
              Choose the visual theme for your live projector/presenter screen
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setOutputTheme && setOutputTheme("dark")}
              className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition cursor-pointer ${
                outputTheme === "dark"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-panel text-text-secondary hover:border-border-strong hover:text-text-primary"
              }`}
            >
              <div className="w-full h-10 rounded bg-[#0B0C0E] border border-[#2A2C31] flex items-center justify-center text-[10px] text-white font-semibold">
                DARK MODE
              </div>
              <span className="text-xs font-bold">Dark Obsidian</span>
            </button>

            <button
              type="button"
              onClick={() => setOutputTheme && setOutputTheme("light")}
              className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition cursor-pointer ${
                outputTheme === "light"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-panel text-text-secondary hover:border-border-strong hover:text-text-primary"
              }`}
            >
              <div className="w-full h-10 rounded bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-center text-[10px] text-[#111827] font-semibold">
                LIGHT MODE
              </div>
              <span className="text-xs font-bold">Light Clean</span>
            </button>

            <button
              type="button"
              onClick={() => setOutputTheme && setOutputTheme("image")}
              className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition cursor-pointer ${
                outputTheme === "image"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-panel text-text-secondary hover:border-border-strong hover:text-text-primary"
              }`}
            >
              <div className="w-full h-10 rounded bg-linear-to-r from-blue-900 to-indigo-900 border border-blue-700 flex items-center justify-center text-[10px] text-white font-semibold">
                IMAGE WALLPAPER
              </div>
              <span className="text-xs font-bold">Custom Image</span>
            </button>

            <button
              type="button"
              onClick={() => setOutputTheme && setOutputTheme("video")}
              className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition cursor-pointer ${
                outputTheme === "video"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-panel text-text-secondary hover:border-border-strong hover:text-text-primary"
              }`}
            >
              <div className="w-full h-10 rounded bg-linear-to-r from-purple-950 via-slate-900 to-amber-950 border border-amber-500/50 flex items-center justify-center text-[10px] text-amber-300 font-semibold gap-1">
                <FaFilm className="animate-pulse" /> MOTION VIDEO
              </div>
              <span className="text-xs font-bold">Motion Video</span>
            </button>
          </div>
        </div>

        {/* Background Image Configuration */}
        {outputTheme === "image" && (
          <div className="p-4 rounded border border-border bg-surface space-y-3">
            <div>
              <div className="font-semibold text-xs text-text-primary">
                Background Wallpaper Image
              </div>
              <div className="text-[11px] text-text-secondary">
                Provide an image URL or choose a worship preset wallpaper
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste image URL (https://...)"
                  value={outputBgImage || ""}
                  onChange={(e) =>
                    setOutputBgImage && setOutputBgImage(e.target.value)
                  }
                  className="flex-1 text-xs rounded px-3 py-1.5 outline-none border border-border bg-raised text-text-primary placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={async () => {
                    // Copies into the app's media folder. The old code read the
                    // file as a data URI into localStorage, which blows past the
                    // ~5 MB quota for anything but a small image.
                    const result = await window.api.pickMediaFiles();
                    if (!result || !result.success) return;
                    const picked = (result.media || []).find((m) => m.kind === "image");
                    if (!picked) return;
                    const map = await window.api.resolveMediaUrls([picked.storedName]);
                    const url = map?.[picked.storedName]?.url;
                    if (url) {
                      if (setOutputBgImage) setOutputBgImage(url);
                      if (setOutputTheme) setOutputTheme("image");
                    }
                  }}
                  className="px-3 py-1.5 bg-accent hover:bg-accent/90 text-bg font-bold rounded text-xs cursor-pointer flex items-center"
                >
                  Browse File
                </button>
              </div>

              {/* Wallpaper Presets */}
              <div className="pt-2">
                <div className="text-[10px] uppercase font-bold tracking-wider mb-2 text-text-secondary">
                  Recommended Worship Image Presets:
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (setOutputBgImage) setOutputBgImage("dark-horizon");
                      if (setOutputTheme) setOutputTheme("image");
                    }}
                    className="h-12 rounded border border-white/20 bg-cover bg-center overflow-hidden flex items-end p-1 transition hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundImage: `url('${OUTPUT_BACKGROUNDS["dark-horizon"].url}')`,
                    }}
                  >
                    <span className="text-[9px] font-bold text-white bg-black/60 px-1 rounded">
                      Dark Horizon
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (setOutputBgImage) setOutputBgImage("worship-light");
                      if (setOutputTheme) setOutputTheme("image");
                    }}
                    className="h-12 rounded border border-white/20 bg-cover bg-center overflow-hidden flex items-end p-1 transition hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundImage: `url('${OUTPUT_BACKGROUNDS["worship-light"].url}')`,
                    }}
                  >
                    <span className="text-[9px] font-bold text-white bg-black/60 px-1 rounded">
                      Worship Light
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (setOutputBgImage) setOutputBgImage("starry-night");
                      if (setOutputTheme) setOutputTheme("image");
                    }}
                    className="h-12 rounded border border-white/20 bg-cover bg-center overflow-hidden flex items-end p-1 transition hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundImage: `url('${OUTPUT_BACKGROUNDS["starry-night"].url}')`,
                    }}
                  >
                    <span className="text-[9px] font-bold text-white bg-black/60 px-1 rounded">
                      Starry Night
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (setOutputBgImage) setOutputBgImage("nature-fog");
                      if (setOutputTheme) setOutputTheme("image");
                    }}
                    className="h-12 rounded border border-white/20 bg-cover bg-center overflow-hidden flex items-end p-1 transition hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundImage: `url('${OUTPUT_BACKGROUNDS["nature-fog"].url}')`,
                    }}
                  >
                    <span className="text-[9px] font-bold text-white bg-black/60 px-1 rounded">
                      Nature Fog
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Motion Video Wallpaper Configuration */}
        {outputTheme === "video" && (
          <div className="p-4 rounded border border-border bg-surface space-y-3">
            <div>
              <div className="font-semibold text-xs text-text-primary flex items-center gap-1.5">
                <FaFilm className="text-amber-400" /> Background Motion Video
                Wallpaper
              </div>
              <div className="text-[11px] text-text-secondary">
                Select a looping video preset or load a local MP4/WebM video
                file from your computer
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste video URL (https://...mp4)"
                  value={outputBgVideo || ""}
                  onChange={(e) =>
                    setOutputBgVideo && setOutputBgVideo(e.target.value)
                  }
                  className="flex-1 text-xs rounded px-3 py-1.5 outline-none border border-border bg-raised text-text-primary placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={async () => {
                    // Same as the image picker: copy into the media folder and
                    // store the resolved URL, never a base64 data URI.
                    const result = await window.api.pickMediaFiles();
                    if (!result || !result.success) return;
                    const picked = (result.media || []).find((m) => m.kind === "video");
                    if (!picked) return;
                    const map = await window.api.resolveMediaUrls([picked.storedName]);
                    const url = map?.[picked.storedName]?.url;
                    if (url) {
                      if (setOutputBgVideo) setOutputBgVideo(url);
                      if (setOutputTheme) setOutputTheme("video");
                    }
                  }}
                  className="px-3 py-1.5 bg-accent hover:bg-accent/90 text-bg font-bold rounded text-xs cursor-pointer flex items-center gap-1 transition shadow-xs"
                >
                  <FaFilm size={12} /> Browse Video File
                </button>
              </div>

              {/* Video Motion Presets */}
              <div className="pt-2">
                <div className="text-[10px] uppercase font-bold tracking-wider mb-2 text-text-secondary">
                  Recommended Worship Motion Video Loops:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (setOutputBgVideo) setOutputBgVideo("galaxy-stars");
                      if (setOutputTheme) setOutputTheme("video");
                    }}
                    className={`h-14 rounded border relative overflow-hidden flex items-end p-1.5 transition hover:opacity-95 cursor-pointer ${
                      outputBgVideo === "galaxy-stars"
                        ? "border-amber-400 ring-2 ring-amber-400/40"
                        : "border-white/20"
                    }`}
                  >
                    <video
                      src={OUTPUT_VIDEOS["galaxy-stars"].url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <span className="relative z-10 text-[9px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded">
                      Galaxy Stars
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (setOutputBgVideo) setOutputBgVideo("earth-night");
                      if (setOutputTheme) setOutputTheme("video");
                    }}
                    className={`h-14 rounded border relative overflow-hidden flex items-end p-1.5 transition hover:opacity-95 cursor-pointer ${
                      outputBgVideo === "earth-night"
                        ? "border-amber-400 ring-2 ring-amber-400/40"
                        : "border-white/20"
                    }`}
                  >
                    <video
                      src={OUTPUT_VIDEOS["earth-night"]?.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <span className="relative z-10 text-[9px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded">
                      Earth Night
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (setOutputBgVideo) setOutputBgVideo("aurora-lights");
                      if (setOutputTheme) setOutputTheme("video");
                    }}
                    className={`h-14 rounded border relative overflow-hidden flex items-end p-1.5 transition hover:opacity-95 cursor-pointer ${
                      outputBgVideo === "aurora-lights"
                        ? "border-amber-400 ring-2 ring-amber-400/40"
                        : "border-white/20"
                    }`}
                  >
                    <video
                      src={OUTPUT_VIDEOS["aurora-lights"].url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <span className="relative z-10 text-[9px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded">
                      Aurora Lights
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (setOutputBgVideo) setOutputBgVideo("cinematic-clouds");
                      if (setOutputTheme) setOutputTheme("video");
                    }}
                    className={`h-14 rounded border relative overflow-hidden flex items-end p-1.5 transition hover:opacity-95 cursor-pointer ${
                      outputBgVideo === "cinematic-clouds"
                        ? "border-amber-400 ring-2 ring-amber-400/40"
                        : "border-white/20"
                    }`}
                  >
                    <video
                      src={OUTPUT_VIDEOS["cinematic-clouds"].url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <span className="relative z-10 text-[9px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded">
                      Cinematic Clouds
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* App Name Display & Branding Position Settings */}
        <div className="p-4 rounded border border-border bg-surface space-y-3">
          <div>
            <div className="font-semibold text-xs text-text-primary">
              App Name &amp; Branding Position on Projector
            </div>
            <div className="text-[11px] text-text-secondary">
              Configure where and how the app title is displayed on the live
              presentation window
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold mb-1 text-text-primary">
                Branding Display Location
              </label>
              <select
                value={appNamePosition || "top-left"}
                onChange={(e) =>
                  setAppNamePosition && setAppNamePosition(e.target.value)
                }
                className="w-full text-xs rounded px-2.5 py-1.5 outline-none border border-border bg-raised text-text-primary"
              >
                <option value="top-left">Top Header Left (Default)</option>
                <option value="top-right">Top Header Right</option>
                <option value="bottom-left">Bottom Footer Left</option>
                <option value="bottom-right">Bottom Footer Right</option>
                <option value="hidden">Hidden (Do Not Display App Name)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1 text-text-primary">
                Header Branding Text
              </label>
              <input
                type="text"
                placeholder="WorshipDesk"
                value={customHeaderTitle ?? "WorshipDesk"}
                onChange={(e) =>
                  setCustomHeaderTitle && setCustomHeaderTitle(e.target.value)
                }
                className="w-full text-xs rounded px-2.5 py-1.5 outline-none border border-border bg-raised text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>
        </div>

        {/* Projector Mini Preview */}
        <div className="p-4 rounded border border-border bg-surface space-y-2">
          <div className="font-semibold text-xs text-text-primary">
            Live Projector Output Preview
          </div>
          <div
            className={`w-full aspect-video rounded-lg overflow-hidden border border-border-strong relative flex flex-col justify-between shadow-inner ${
              outputTheme === "light"
                ? "bg-[#FFFFFF] text-[#111827]"
                : outputTheme === "dark"
                  ? "bg-[#0B0C0E] text-white"
                  : "text-white"
            }`}
            style={{
              padding:
                slideMargin === "2rem"
                  ? "0.5rem"
                  : slideMargin === "6rem"
                    ? "1.25rem"
                    : "0.8rem",
            }}
          >
            {outputTheme === "image" ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${resolveBackground(
                    outputBgImage || "dark-horizon",
                  )}")`,
                }}
              >
                <div className="absolute inset-0 bg-black/60" />
              </div>
            ) : null}

            {outputTheme === "video" ? (
              <div className="absolute inset-0 overflow-hidden">
                <video
                  src={resolveVideo(outputBgVideo || "galaxy-stars")}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            ) : null}

            <div className="relative z-10 h-full flex flex-col justify-between">
              {/* Header */}
              <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-accent uppercase border-b border-current/20 pb-2">
                <span>
                  {appNamePosition === "top-left"
                    ? customHeaderTitle
                    : "Bible Verse"}
                </span>
                <span>
                  {appNamePosition === "top-left"
                    ? "Bible Verse"
                    : appNamePosition === "top-right"
                      ? customHeaderTitle
                      : ""}
                </span>
              </div>

              {/* Content */}
              <div className="my-auto text-center px-4">
                <p
                  className={`font-bold leading-relaxed ${
                    outputTheme === "image" || outputTheme === "video"
                      ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      : ""
                  } ${
                    outputFontSize === "small"
                      ? "text-[10px]"
                      : outputFontSize === "large"
                        ? "text-base"
                        : outputFontSize === "xlarge"
                          ? "text-lg"
                          : outputFontSize === "xxlarge"
                            ? "text-xl"
                            : "text-xs"
                  }`}
                >
                  {showVerseQuotes
                    ? '"For God so loved the world, that he gave his only begotten Son..."'
                    : "For God so loved the world, that he gave his only begotten Son..."}
                </p>
              </div>

              {/* Footer */}
              {attributionPosition === "top" ? (
                <div className="flex items-center justify-center pt-2 border-t border-current/20 text-[10px] font-bold text-accent uppercase">
                  — JOHN 3:16 (KJV) —
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2 border-t border-current/20 text-[10px] font-bold text-accent uppercase">
                  <div
                    className={`${
                      attributionPosition === "bottom"
                        ? "w-1/4 text-left"
                        : "flex-1"
                    }`}
                  >
                    {appNamePosition === "bottom-left" ? customHeaderTitle : ""}
                  </div>
                  <div
                    className={
                      attributionPosition === "bottom"
                        ? "w-1/2 text-center"
                        : "text-right"
                    }
                  >
                    — JOHN 3:16 (KJV) —
                  </div>
                  <div
                    className={`${
                      attributionPosition === "bottom"
                        ? "w-1/4 text-right"
                        : "flex-1"
                    }`}
                  >
                    {appNamePosition === "bottom-right"
                      ? customHeaderTitle
                      : ""}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded border border-border bg-surface">
          <div>
            <div className="font-semibold text-xs text-text-primary">
              Slide Margin Padding
            </div>
            <div className="text-[11px] text-text-secondary">
              Safe viewport distance for projector projection
            </div>
          </div>
          <select
            value={slideMargin || "4rem"}
            onChange={(e) => setSlideMargin && setSlideMargin(e.target.value)}
            className="text-xs rounded px-2.5 py-1 outline-none border border-border bg-raised text-text-primary"
          >
            <option value="2rem">Compact </option>
            <option value="4rem">Standard </option>
            <option value="6rem">Wide Safe Zone </option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded border border-border bg-surface">
          <div>
            <div className="font-semibold text-xs text-text-primary">
              Attribution Line Position
            </div>
            <div className="text-[11px] text-text-secondary">
              Scripture &amp; hymn reference text alignment
            </div>
          </div>
          <select
            value={attributionPosition || "bottom"}
            onChange={(e) =>
              setAttributionPosition && setAttributionPosition(e.target.value)
            }
            className="text-xs rounded px-2.5 py-1 outline-none border border-border bg-raised text-text-primary"
          >
            <option value="bottom">Bottom Centered</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="top">Top Header Line</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded border border-border bg-surface">
          <div>
            <div className="font-semibold text-xs text-text-primary">
              Projector Text Scale
            </div>
            <div className="text-[11px] text-text-secondary">
              Font size for scripture &amp; hymn content on the live output
            </div>
          </div>
          <select
            value={outputFontSize || "normal"}
            onChange={(e) =>
              setOutputFontSize && setOutputFontSize(e.target.value)
            }
            className="text-xs rounded px-2.5 py-1 outline-none border border-border bg-raised text-text-primary"
          >
            <option value="small">Small </option>
            <option value="normal">Standard </option>
            <option value="large">Large </option>
            <option value="xlarge">Extra Large </option>
            <option value="xxlarge">XX-Large</option>
          </select>
        </div>
      </div>
    </div>
  );
}
