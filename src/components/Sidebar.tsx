import React from "react";
import { useStudy } from "../context/StudyContext";
import { ActiveTab } from "../types";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Calendar,
  CheckSquare,
  BarChart3,
  Lightbulb,
  Settings,
  LogOut,
  Flame,
} from "lucide-react";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { activeTab, setActiveTab, user, profile, logout } = useStudy();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "subjects", label: "My Subjects", icon: <BookOpen className="w-5 h-5" /> },
    { id: "planner", label: "AI Planner", icon: <Sparkles className="w-5 h-5" />, badge: "AI" },
    { id: "schedule", label: "Schedule", icon: <Calendar className="w-5 h-5" /> },
    { id: "tasks", label: "Tasks", icon: <CheckSquare className="w-5 h-5" /> },
    { id: "focus", label: "Focus Mode", icon: <Flame className="w-5 h-5" />, badge: "25m" },
    { id: "progress", label: "Progress", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "insights", label: "AI Insights", icon: <Lightbulb className="w-5 h-5" />, badge: "Smart" },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const handleSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 h-full bg-slate-900 dark:bg-[#070A11] text-slate-200 flex flex-col justify-between border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div>
        <div
          onClick={() => handleSelect("dashboard")}
          className="p-6 cursor-pointer border-b border-slate-800/80 group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-600/30 shrink-0">
            ✦
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              StudyFlow <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded border border-indigo-500/30">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
              Make every hour count.
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-white" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-indigo-700/80 text-white"
                        : "bg-indigo-900/60 text-indigo-300 border border-indigo-700/40"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User / Profile Footer */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
          <div
            onClick={() => handleSelect("settings")}
            className="flex items-center gap-2.5 overflow-hidden cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="truncate text-left">
              <p className="text-xs font-bold text-white truncate">
                {profile.name || user?.name || "Student"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {profile.degree || "University Student"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700/50 transition"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
