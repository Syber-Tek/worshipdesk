import React from "react";
import {
  Home,
  Document,
  Voice2,
  Category,
  Setting,
  ShieldDone,
} from "react-iconly";
import { FaBookOpen, FaMusic, FaSliders } from "react-icons/fa6";

export default function IconRail({ activeTab, setActiveTab, themeMode }) {
  const navItems = [
    { id: "home", icon: Home, label: "Dashboard Home" },
    { id: "plan", icon: FaSliders, label: "Service Planner" },
    { id: "bible", icon: FaBookOpen, label: "Bible & Scripture" },
    { id: "songs", icon: FaMusic, label: "Songs & Hymns" },
    { id: "settings", icon: Setting, label: "Settings" },
  ];

  const isLight = themeMode === "light";

  return (
    <aside
      className={`w-13 border-r flex flex-col items-center justify-between py-3 z-20 transition-colors duration-200 ${
        isLight
          ? "bg-[#FFFFFF] border-[#E5E7EB]"
          : "bg-[#121316] border-border"
      }`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-extrabold text-xs">
          WD
        </div>

        <nav className="flex flex-col items-center gap-1.5 w-full mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`relative w-full h-11 flex items-center justify-center text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "text-accent"
                    : isLight
                      ? "text-[#6B7280] hover:text-[#111827]"
                      : "text-[#9B9CA3] hover:text-text-primary"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.75 bg-accent rounded-r-full" />
                )}
                <Icon
                  set={isActive ? "bold" : "light"}
                  primaryColor="currentColor"
                  size="20"
                />
              </button>
            );
          })}
        </nav>
      </div>

      <div
        title="100% Offline Mode Active"
        className="text-success p-2 flex items-center justify-center cursor-pointer"
      >
        <ShieldDone set="bold" primaryColor="currentColor" size="small" />
      </div>
    </aside>
  );
}
