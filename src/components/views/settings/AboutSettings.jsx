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
}) {
  const [version, setVersion] = React.useState(null);
  const [update, setUpdate] = React.useState({ status: "idle" });

  React.useEffect(() => {
    if (window.api?.getAppInfo) {
      window.api
        .getAppInfo()
        .then((info) => setVersion(info?.version ?? null))
        .catch(() => {});
    }
    if (!window.api?.onUpdaterStatus) return;
    const unsubscribe = window.api.onUpdaterStatus((payload) => {
      if (payload && payload.status) setUpdate(payload);
    });
    return typeof unsubscribe === "function" ? unsubscribe : undefined;
  }, []);

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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-accent flex items-center gap-2">
          <FaCircleInfo /> About App
        </h3>
        <p className={`text-xs mt-1 ${textSub}`}>
          WorshipDesk — offline-first church presentation, version info, and
          release notes.
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
            <span className={`text-xs ${textSub}`}>September 18, 2026</span>
          </div>

          <div className="space-y-3">
            <h2 className={`text-sm font-bold ${textTitle}`}>
              Welcome to WorshipDesk 1.0
            </h2>
            <p className={`text-xs ${textSub} leading-relaxed max-w-2xl`}>
              WorshipDesk 1.0 is an offline-first church presentation app, built
              with a focus on reliability, speed, and a smoother overall
              experience. From launching scriptures to projecting hymns,
              everything should feel more snappy and refined across the board.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <h2 className={`text-sm font-bold ${textTitle}`}>
              A few standout improvements
            </h2>

            <ul
              className={`space-y-3 text-xs ${textSub} list-disc list-inside leading-relaxed pl-1 max-w-2xl`}
            >
              <li>
                <span className={`font-semibold ${textTitle}`}>
                  Scripture lookup is quicker to respond
                </span>
                , with indexed local SQLite database search across NIV, KJV,
                NKJV, and Twi translations.
              </li>
              <li>
                <span className={`font-semibold ${textTitle}`}>
                  In longer services, WorshipDesk does a better job maintaining
                  context
                </span>
                , rendering Methodist and Presbyterian hymnals with zero lag.
              </li>
              <li>
                <span className={`font-semibold ${textTitle}`}>
                  Multi-monitor projector output has been significantly improved
                </span>
                . Dual-window IPC canvas rendering delivers smooth projections
                for secondary displays, TVs, and OBS/vMix live streams.
              </li>
              <li>
                <span className={`font-semibold ${textTitle}`}>
                  100% Offline Resilience
                </span>
                . All scriptures, hymnals, fonts, and logic run locally on
                Windows without requiring active internet connectivity.
              </li>
            </ul>
          </div>

          {/* Software Updates */}
          <div className="space-y-3 pt-4 border-t border-current/10">
            <h2 className={`text-sm font-bold ${textTitle}`}>Software Updates</h2>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onCheck}
                disabled={isBusy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-current/10 text-xs font-semibold hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowRotateRight
                  className={status === "checking" ? "animate-spin" : ""}
                />
                Check for updates
              </button>

              {status === "available" && !update.manualOnly && (
                <button
                  onClick={() => window.api?.downloadUpdate?.()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D3822] text-[#34D399] border border-[#10B981]/30 text-xs font-semibold"
                >
                  <FaDownload /> Download v{update.version}
                </button>
              )}

              {status === "downloaded" && !update.manualOnly && (
                <button
                  onClick={() => window.api?.installUpdate?.()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D3822] text-[#34D399] border border-[#10B981]/30 text-xs font-semibold"
                >
                  <FaCircleCheck /> Restart &amp; install
                </button>
              )}

              {(status === "available" || status === "downloaded") &&
                update.manualOnly && (
                  <button
                    onClick={() => window.api?.openReleasesPage?.()}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D3822] text-[#34D399] border border-[#10B981]/30 text-xs font-semibold"
                  >
                    <FaDownload /> Open downloads page
                  </button>
                )}
            </div>

            <p className={`text-xs ${textSub} min-h-4`}>
              {status === "idle" && "WorshipDesk checks for updates when you ask it to."}
              {status === "checking" && "Checking for updates…"}
              {status === "up-to-date" &&
                `WorshipDesk ${update.version ?? ""} is up to date.`}
              {status === "available" &&
                (update.manualOnly
                  ? `Version ${update.version} is available. macOS builds are not code-signed, so download it from the releases page.`
                  : `Version ${update.version} is available.`)}
              {status === "downloading" &&
                `Downloading ${update.percent ?? 0}%…`}
              {status === "downloaded" &&
                (update.manualOnly
                  ? `Version ${update.version} downloaded. Install it from the releases page.`
                  : "Update ready. Restart to install — or just quit normally and it will install.")}
              {status === "error" && (update.message || "Could not check for updates.")}
            </p>
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
