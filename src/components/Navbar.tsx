import React from "react";
import { useStudy } from "../context/StudyContext";
import { Sparkles, Menu, Cpu, Moon, Sun, Play } from "lucide-react";

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { activeTab, setActiveTab, profile, serverStatus, darkMode, toggleDarkMode, startFocusMode } = useStudy();

  const getTabDetails = () => {
    switch (activeTab) {
      case "dashboard":
        return { title: "Study Dashboard", subtitle: `Welcome back, ${profile.name}` };
      case "subjects":
        return { title: "My Subjects", subtitle: "Manage coursework, syllabus, and exam targets" };
      case "planner":
        return { title: "AI Study Planner", subtitle: "Generate adaptive timetables with Gemini AI" };
      case "schedule":
        return { title: "Weekly Timetable", subtitle: "Calendar view of scheduled study blocks" };
      case "tasks":
        return { title: "Task Manager", subtitle: "Track daily study sessions and completed topics" };
      case "focus":
        return { title: "Focus Mode", subtitle: "Distraction-free deep work timer" };
      case "progress":
        return { title: "Progress Analytics", subtitle: "Track subject mastery, weekly hours, and consistency" };
      case "insights":
        return { title: "AI Insights & Recommendations", subtitle: "Intelligent academic guidance generated for you" };
      case "settings":
        return { title: "Profile & Preferences", subtitle: "Configure daily hours, semester targets, and accounts" };
      default:
        return { title: "StudyFlow AI", subtitle: "Study smarter. Make every hour count." };
    }
  };

  const details = getTabDetails();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Menu button + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
            {details.title}
          </h2>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-normal">
            {details.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Theme Toggle + Engine indicator + Quick Action */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Gemini Engine indicator */}
        <div
          title={
            serverStatus.geminiConfigured
              ? "Gemini AI server engine active"
              : "Gemini server connected (using adaptive optimizer)"
          }
          className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
        >
          <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Gemini AI Engine</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Focus Mode button */}
        {activeTab !== "focus" && (
          <button
            onClick={() => startFocusMode()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Focus Mode</span>
          </button>
        )}

        {/* Quick AI Planner CTA */}
        {activeTab !== "planner" && (
          <button
            id="nav-quick-plan-btn"
            onClick={() => setActiveTab("planner")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Study Plan</span>
            <span className="sm:hidden">Plan</span>
          </button>
        )}
      </div>
    </header>
  );
};
