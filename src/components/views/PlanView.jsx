import React, { useState } from "react";
import {
  TickSquare,
  Show,
  Send,
  ArrowUp,
  ArrowDown,
  Delete,
  InfoSquare,
} from "react-iconly";
import {
  FaPlus,
  FaSliders,
  FaFloppyDisk,
  FaFolderOpen,
  FaClockRotateLeft,
  FaTrashCan,
  FaFileLines,
} from "react-icons/fa6";

export default function PlanView({
  playlist = [],
  setShowAddModal,
  handleSelectItem,
  handlePresentItemNow,
  handleMoveUp,
  handleMoveDown,
  handleDeleteItem,
  recentPlans = [],
  handleSavePlanToFile,
  handleOpenPlanFromFile,
  handleLoadRecentPlan,
  handleClearPlan,
  themeMode,
}) {
  const isLight = themeMode === "light";
  const [showRecentMenu, setShowRecentMenu] = useState(false);

  return (
    <div className="space-y-4 max-w-4xl w-full mx-auto">
      <div
        className={`p-5 rounded-lg border space-y-4 transition-colors duration-200 ${
          isLight
            ? "bg-[#FFFFFF] border-[#E5E7EB]"
            : "bg-[#151619] border-[#2A2C31]"
        }`}
      >
        {/* Header & Main Actions */}
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-3 ${
            isLight ? "border-[#E5E7EB]" : "border-[#2A2C31]"
          }`}
        >
          <div>
            <h2 className="text-sm font-bold text-accent flex items-center gap-2">
              <FaSliders className="text-accent" /> Sunday Service Order
              Playlist
            </h2>
            <p
              className={`text-[11px] mt-0.5 ${
                isLight ? "text-[#6B7280]" : "text-[#9B9CA3]"
              }`}
            >
              Save, load, and manage your worship service schedules (.worship /
              .json).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Save Plan Button */}
            <button
              type="button"
              onClick={handleSavePlanToFile}
              title="Save Service Plan to file on disk"
              className={`px-3 py-1.5 border rounded font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                isLight
                  ? "bg-[#F3F4F6] hover:bg-[#E5E7EB] border-[#E5E7EB] text-[#111827]"
                  : "bg-raised hover:bg-hover border-border text-text-primary"
              }`}
            >
              <FaFloppyDisk className="text-accent" /> Save Plan
            </button>

            {/* Open Plan Button */}
            <button
              type="button"
              onClick={handleOpenPlanFromFile}
              title="Open / Load Service Plan from disk"
              className={`px-3 py-1.5 border rounded font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                isLight
                  ? "bg-[#F3F4F6] hover:bg-[#E5E7EB] border-[#E5E7EB] text-[#111827]"
                  : "bg-raised hover:bg-hover border-border text-text-primary"
              }`}
            >
              <FaFolderOpen className="text-amber-400" /> Open Plan
            </button>

            {/* Recent Plans Popover Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRecentMenu(!showRecentMenu)}
                title="View recent service plans history"
                className={`px-3 py-1.5 border rounded font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  showRecentMenu
                    ? "border-accent bg-accent/10 text-accent"
                    : isLight
                      ? "bg-[#F3F4F6] hover:bg-[#E5E7EB] border-[#E5E7EB] text-[#111827]"
                      : "bg-raised hover:bg-hover border-border text-text-primary"
                }`}
              >
                <FaClockRotateLeft className="text-blue-400" /> Recent Plans
              </button>

              {/* Recent Plans Dropdown Menu */}
              {showRecentMenu && (
                <div
                  className={`absolute right-0 mt-2 w-72 rounded-lg border shadow-xl z-50 p-2 space-y-1.5 ${
                    isLight
                      ? "bg-white border-[#E5E7EB] text-[#111827]"
                      : "bg-[#1C1D21] border-[#2A2C31] text-text-primary"
                  }`}
                >
                  <div className="flex items-center justify-between px-2 py-1 border-b border-border text-[11px] font-bold uppercase tracking-wider text-accent">
                    <span>Recent Service Plans</span>
                    <button
                      onClick={() => setShowRecentMenu(false)}
                      className="text-text-muted hover:text-text-primary text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  {recentPlans.length === 0 ? (
                    <div className="p-4 text-center text-xs text-text-muted">
                      No recently saved or opened plans.
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {recentPlans.map((entry, idx) => (
                        <button
                          key={entry.filePath || idx}
                          type="button"
                          onClick={() => {
                            if (handleLoadRecentPlan) handleLoadRecentPlan(entry);
                            setShowRecentMenu(false);
                          }}
                          className={`w-full text-left p-2 rounded border transition text-xs flex items-center gap-2 cursor-pointer ${
                            isLight
                              ? "hover:bg-[#F3F4F6] border-[#E5E7EB]"
                              : "hover:bg-raised border-[#2A2C31]"
                          }`}
                        >
                          <FaFileLines className="text-accent shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold truncate">
                              {entry.fileName || entry.title}
                            </div>
                            <div className="text-[10px] text-text-muted flex items-center gap-2">
                              <span>{entry.itemsCount || 0} items</span>
                              {entry.savedAt && <span>• {entry.savedAt}</span>}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Clear Plan Button */}
            {playlist.length > 0 && (
              <button
                type="button"
                onClick={handleClearPlan}
                title="Clear current service playlist"
                className={`px-2.5 py-1.5 border rounded font-semibold text-xs transition cursor-pointer flex items-center gap-1 text-red-400 ${
                  isLight
                    ? "bg-[#FEE2E2] hover:bg-[#FCA5A5] border-[#FCA5A5]"
                    : "bg-red-950/40 hover:bg-red-900/60 border-red-900/60"
                }`}
              >
                <FaTrashCan size={11} /> Clear
              </button>
            )}

            {/* Add Service Item Button */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent/90 text-text-primary rounded font-semibold text-xs transition shadow cursor-pointer"
            >
              <FaPlus /> Add Item
            </button>
          </div>
        </div>

        {/* Playlist Content */}
        {playlist.length === 0 ? (
          <div
            className={`p-8 rounded-lg border text-center space-y-3 ${
              isLight
                ? "bg-[#F3F4F6] border-[#E5E7EB]"
                : "bg-[#1C1D21] border-[#2A2C31]"
            }`}
          >
            <div className="flex justify-center">
              <InfoSquare
                set="light"
                primaryColor={isLight ? "#9CA3AF" : "#6B6C73"}
                size="large"
              />
            </div>
            <h3
              className={`text-sm font-bold ${
                isLight ? "text-[#111827]" : "text-text-primary"
              }`}
            >
              No Items in Service Playlist
            </h3>
            <p
              className={`text-xs max-w-sm mx-auto ${
                isLight ? "text-[#4B5563]" : "text-[#9B9CA3]"
              }`}
            >
              Your service order is currently empty. Add scripture readings,
              hymns, or sermon slides, or open an existing plan file.
            </p>
            <div className="flex justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleOpenPlanFromFile}
                className="px-3.5 py-2 border border-border bg-raised hover:bg-hover font-semibold text-xs rounded shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <FaFolderOpen className="text-amber-400" /> Open Saved Plan
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-accent text-text-primary font-semibold text-xs rounded shadow hover:bg-accent/90 transition cursor-pointer flex items-center gap-1.5"
              >
                <FaPlus /> Add Service Item
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.map((item, index) => (
              <div
                key={item.id || index}
                className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-150 ${
                  isLight
                    ? "bg-[#F9FAFB] hover:bg-[#F3F4F6] border-[#E5E7EB]"
                    : "bg-[#1C1D21] hover:bg-[#24262B] border-[#2A2C31]"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 rounded bg-accent/10 border border-accent/30 text-accent font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/20 text-accent uppercase tracking-wider">
                        {item.type || "Slide"}
                      </span>
                      <h4
                        className={`font-bold text-xs truncate ${
                          isLight ? "text-[#111827]" : "text-text-primary"
                        }`}
                      >
                        {item.title}
                      </h4>
                    </div>
                    <p
                      className={`text-[11px] line-clamp-2 mt-1 leading-relaxed ${
                        isLight ? "text-[#4B5563]" : "text-[#9B9CA3]"
                      }`}
                    >
                      {item.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end border-border">
                  <button
                    onClick={() => handleSelectItem && handleSelectItem(item)}
                    className={`px-2.5 py-1.5 border rounded text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                      isLight
                        ? "bg-[#FFFFFF] hover:bg-[#F3F4F6] border-[#E5E7EB] text-[#111827]"
                        : "bg-raised hover:bg-hover border-border text-text-primary"
                    }`}
                    title="Stage into Next Slide Buffer"
                  >
                    <Show set="bold" primaryColor="#D4A94A" size="small" />{" "}
                    Stage
                  </button>

                  <button
                    onClick={() =>
                      handlePresentItemNow && handlePresentItemNow(item)
                    }
                    className="px-2.5 py-1.5 bg-accent hover:bg-accent/90 text-text-primary font-bold rounded text-xs flex items-center gap-1 shadow transition cursor-pointer"
                    title="Present Live on Projector"
                  >
                    <Send set="bold" primaryColor="#0B0C0E" size="small" />{" "}
                    Present
                  </button>

                  <div className="h-4 w-px bg-border mx-1" />

                  <button
                    onClick={() => handleMoveUp && handleMoveUp(index)}
                    disabled={index === 0}
                    className={`p-1.5 rounded border transition ${
                      index === 0
                        ? "opacity-30 cursor-not-allowed border-transparent"
                        : isLight
                          ? "hover:bg-[#E5E7EB] border-[#E5E7EB]"
                          : "hover:bg-hover border-border"
                    }`}
                    title="Move Item Up"
                  >
                    <ArrowUp set="bold" primaryColor="#9B9CA3" size="small" />
                  </button>

                  <button
                    onClick={() => handleMoveDown && handleMoveDown(index)}
                    disabled={index === playlist.length - 1}
                    className={`p-1.5 rounded border transition ${
                      index === playlist.length - 1
                        ? "opacity-30 cursor-not-allowed border-transparent"
                        : isLight
                          ? "hover:bg-[#E5E7EB] border-[#E5E7EB]"
                          : "hover:bg-hover border-border"
                    }`}
                    title="Move Item Down"
                  >
                    <ArrowDown set="bold" primaryColor="#9B9CA3" size="small" />
                  </button>

                  <button
                    onClick={() => handleDeleteItem && handleDeleteItem(index)}
                    className="p-1.5 rounded border border-transparent hover:border-red-900/50 hover:bg-red-950/30 text-red-400 transition cursor-pointer"
                    title="Remove Item"
                  >
                    <Delete set="bold" primaryColor="#EB5757" size="small" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
