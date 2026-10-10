import React from "react";
import appIconDark from "../assets/app-icon-dark.png";
import appIconLight from "../assets/app-icon-light.png";
import {
  Home,
  Document,
  Voice2,
  Category,
  Setting,
  ShieldDone,
} from "react-iconly";
import { FaBookBible, FaMusic, FaSliders } from "react-icons/fa6";

export default function IconRail({ activeTab, setActiveTab, themeMode }) {
  const navItems = [
    { id: "home", icon: Home, label: "Dashboard Home" },
    { id: "plan", icon: FaSliders, label: "Service Planner" },
    { id: "bible", icon: FaBookBible, label: "Bible & Scripture" },
    { id: "songs", icon: FaMusic, label: "Songs & Hymns" },
    { id: "settings", icon: Setting, label: "Settings" },
  ];

  const isLight = themeMode === "light";

  return (
    <aside
      className={`w-13 border-r flex flex-col items-center justify-between py-3 z-20 transition-colors duration-200 ${
        isLight ? "bg-[#FFFFFF] border-[#E5E7EB]" : "bg-panel border-border"
      }`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center p-0.5 transition-transform duration-200 hover:scale-105">
          <img
            src={isLight ? appIconDark : appIconLight}
            alt="WordDesk Logo"
            className="w-full h-full object-contain"
          />
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
    </aside>
  );
}
