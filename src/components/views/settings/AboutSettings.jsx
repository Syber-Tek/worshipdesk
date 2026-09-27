import React from "react";
import {
  FaCircleInfo,
  FaArrowRotateRight,
  FaDownload,
  FaCircleCheck,
} from "react-icons/fa6";
import appIconDark from "../../../assets/app-icon-dark.png";
import appIconLight from "../../../assets/app-icon-light.png";

export default function AboutSettings({
  cardClass,
  textTitle,
  textSub,
  borderDivider,
  isLight,
}) {
  const [version, setVersion] = React.useState(null);
  const [update, setUpdate] = React.useState({ status: "idle" });
  // Automatic checking is opt-in; the main process owns the real value.
  const [autoCheck, setAutoCheck] = React.useState(false);

  React.useEffect(() => {
    if (window.api?.getAppInfo) {
      window.api
        .getAppInfo()
        .then((info) => setVersion(info?.version ?? null))
        .catch(() => {});
    }
    if (window.api?.getAutoUpdateCheck) {
      window.api
        .getAutoUpdateCheck()
        .then((res) => {
          if (res && typeof res.autoCheck === "boolean") setAutoCheck(res.autoCheck);
        })
        .catch(() => {});
    }
    if (!window.api?.onUpdaterStatus) return;
    const unsubscribe = window.api.onUpdaterStatus((payload) => {
      if (payload && payload.status) setUpdate(payload);
    });
    return typeof unsubscribe === "function" ? unsubscribe : undefined;
  }, []);

  const onToggleAutoCheck = async (next) => {
    setAutoCheck(next);
    if (!window.api?.setAutoUpdateCheck) return;
    const res = await window.api.setAutoUpdateCheck(next).catch(() => null);
    if (res && typeof res.autoCheck === "boolean") setAutoCheck(res.autoCheck);
  };

  const onCheck = async () => {
    if (!window.api?.checkForUpdates) return;
    setUpdate({ status: "checking" });
    const res = await window.api.checkForUpdates().catch(() => null);
    if (res && res.ok === false) {
      setUpdate({ status: "error", message: res.message });
    }
  };

  const status = update.status;
  const isBusy = status === "checking" || status === "downloading";
  const primaryBtn = "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D3822] text-[#34D399] border border-[#10B981]/30 text-xs font-semibold hover:bg-[#10462D]";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-accent flex items-center gap-2">
          <FaCircleInfo /> About &amp; Updates
        </h3>
        <p className={`text-xs mt-1 ${textSub}`}>
          WorshipDesk — offline-first church presentation. Check for updates and
          install a new version without leaving the app.
        </p>
      </div>

      <div className={`space-y-4 pt-2 border-t ${borderDivider}`}>
        <div className={`p-4 rounded border ${cardClass} space-y-3`}>
          <div className="flex items-center gap-3">
            <img
              src={appIconLight}
              alt="WorshipDesk Logo"
              className="w-7 h-7 object-contain rounded-md drop-shadow-sm"
            />
            <span className="bg-[#0D3822] text-[#34D399] border border-[#10B981]/30 rounded-lg px-3 py-1 font-semibold text-xs">
              {version ? `WorshipDesk v${version}` : "WorshipDesk"}
            </span>
            <span className={`text-xs ${textSub}`}>
              100% offline &middot; no account needed
            </span>
          </div>

          {/* Software Updates — kept directly under the version so the check
              button is visible without scrolling. */}
          <div className="space-y-3 pt-1">
            <h2 className={`text-sm font-bold ${textTitle}`}>Software Updates</h2>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onCheck}
                disabled={isBusy}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLight
                    ? "border-[#D1D5DB] text-[#111827] hover:bg-[#F3F4F6]"
                    : "border-current/10 hover:bg-white/5"
                }`}
              >
                <FaArrowRotateRight
                  className={status === "checking" ? "animate-spin" : ""}
                />
                Check for updates
              </button>

              {status === "available" && !update.manualOnly && (
                <button
                  onClick={() => window.api?.downloadUpdate?.()}
                  className={primaryBtn}
                >
                  <FaDownload /> Download v{update.version}
                </button>
              )}

              {status === "downloaded" && !update.manualOnly && (
                <button
                  onClick={() => window.api?.installUpdate?.()}
                  className={primaryBtn}
                >
                  <FaCircleCheck /> Restart &amp; install
                </button>
              )}

              {(status === "available" || status === "downloaded") &&
                update.manualOnly && (
                  <button
                    onClick={() => window.api?.openReleasesPage?.()}
                    className={primaryBtn}
                  >
                    <FaDownload /> Open downloads page
                  </button>
                )}
            </div>

            <p className={`text-xs ${textSub} min-h-4`}>
              {status === "idle" &&
                (autoCheck
                  ? "WorshipDesk checks for a new version shortly after startup and every 6 hours. Nothing is ever downloaded without your say-so."
                  : "Automatic checking is off. Use the button above whenever you want to look for a new version.")}
              {status === "checking" && "Checking for updates…"}
              {status === "up-to-date" &&
                `WorshipDesk ${update.version ?? version ?? ""} is up to date.`}
              {status === "available" &&
                (update.manualOnly
                  ? `Version ${update.version} is available. macOS builds are not code-signed, so download it from the releases page.`
                  : `Version ${update.version} is available.`)}
              {status === "downloading" && `Downloading ${update.percent ?? 0}%…`}
              {status === "downloaded" &&
                (update.manualOnly
                  ? `Version ${update.version} downloaded. Install it from the releases page.`
                  : "Update ready. Restart to install — or just quit normally and it will install.")}
              {status === "error" &&
                (update.message || "Could not check for updates.")}
            </p>

            {/* Automatic check toggle */}
            <label
              className={`flex items-center gap-3 pt-1 cursor-pointer select-none ${
                status === "checking" || status === "downloading"
                  ? "opacity-60"
                  : ""
              }`}
            >
              <button
                type="button"
                role="switch"
                aria-checked={autoCheck}
                aria-label="Automatically check for updates"
                onClick={() =>
                  onToggleAutoCheck(!autoCheck).catch(() => {})
                }
                className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
                  autoCheck ? "bg-[#10B981]" : "bg-[#9CA3AF]"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    autoCheck ? "left-4.5" : "left-0.5"
                  }`}
                />
              </button>
              <span className="text-xs">
                <span className={`font-semibold ${textTitle}`}>
                  Automatically check for updates
                </span>
                <span className={`block ${textSub}`}>
                  Off by default, so the app never touches the network on its
                  own. When on, it only looks for a new version — you still
                  choose whether to download and install it.
                </span>
              </span>
            </label>
          </div>

          <div className="space-y-3 pt-4 border-t border-current/10">
            <h2 className={`text-sm font-bold ${textTitle}`}>
              What&apos;s new in this version
            </h2>

            <ul
              className={`space-y-3 text-xs ${textSub} list-disc list-inside leading-relaxed pl-1 max-w-2xl`}
            >
              <li>
                <span className={`font-semibold ${textTitle}`}>
                  The window now matches your theme
                </span>
                . The title bar and taskbar icon follow the app theme in both
                light and dark mode, and the title bar spans the full width so
                the window buttons no longer cover the live output controls.
              </li>
              <li>
                <span className={`font-semibold ${textTitle}`}>
                  Update from inside the app
                </span>
                . Use the check button above to see whether a newer version is
                available, download it, and install it on the next restart.
              </li>
              <li>
                <span className={`font-semibold ${textTitle}`}>
                  Both Mac chips are supported
                </span>
                . Separate Intel and Apple Silicon builds, and the bundled
                Bibles and hymnals now load correctly from an installed app.
              </li>
              <li>
                <span className={`font-semibold ${textTitle}`}>
                  Faster lookups across the full library
                </span>
                . 10 Bibles, 660 books, 309,149 verses and 2,374 hymns indexed in
                a local SQLite database, with slim theme-matched scrollbars
                throughout.
              </li>
              <li>
                <span className={`font-semibold ${textTitle}`}>
                  100% Offline Resilience
                </span>
                . All scriptures, hymnals, fonts, and logic run locally without
                requiring an active internet connection.
              </li>
            </ul>
          </div>

          <div className="pt-4 text-center border-t border-current/10">
            <p className={`text-xs ${textSub}`}>
              © 2026 WorshipDesk. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
