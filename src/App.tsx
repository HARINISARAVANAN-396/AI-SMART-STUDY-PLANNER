import React, { useState } from "react";
import { StudyProvider, useStudy } from "./context/StudyContext";
import { ToastContainer } from "./components/ToastContainer";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SubjectsPage } from "./pages/SubjectsPage";
import { AIPlannerPage } from "./pages/AIPlannerPage";
import { SchedulePage } from "./pages/SchedulePage";
import { TasksPage } from "./pages/TasksPage";
import { FocusPage } from "./pages/FocusPage";
import { ProgressPage } from "./pages/ProgressPage";
import { InsightsPage } from "./pages/InsightsPage";
import { SettingsPage } from "./pages/SettingsPage";

// Mobile Bottom Nav Icons
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  CheckSquare,
  Flame,
  MoreHorizontal,
  X,
} from "lucide-react";

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useStudy();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is on landing, auth, or onboarding flow
  if (activeTab === "landing") {
    return <LandingPage />;
  }

  if (activeTab === "login" || activeTab === "signup") {
    return <AuthPage initialMode={activeTab} />;
  }

  if (activeTab === "onboarding") {
    return <OnboardingPage />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "subjects":
        return <SubjectsPage />;
      case "planner":
        return <AIPlannerPage />;
      case "schedule":
        return <SchedulePage />;
      case "tasks":
        return <TasksPage />;
      case "focus":
        return <FocusPage />;
      case "progress":
        return <ProgressPage />;
      case "insights":
        return <InsightsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
      {/* Desktop Sidebar (Fixed left) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden backdrop-blur-xs animate-in fade-in"
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 dark:bg-[#070A11] transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 bg-[#F8FAFC] dark:bg-slate-950 transition-colors">
          {renderActivePage()}
        </main>

        {/* Mobile Bottom Navigation Bar (Visible on mobile only) */}
        <nav className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2 flex items-center justify-around z-30 shrink-0">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition ${
              activeTab === "dashboard"
                ? "text-indigo-600 dark:text-indigo-400 font-bold"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("planner")}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition ${
              activeTab === "planner"
                ? "text-indigo-600 dark:text-indigo-400 font-bold"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Plan</span>
          </button>

          <button
            onClick={() => setActiveTab("focus")}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition ${
              activeTab === "focus"
                ? "text-indigo-600 dark:text-indigo-400 font-bold"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Focus</span>
          </button>

          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition ${
              activeTab === "schedule"
                ? "text-indigo-600 dark:text-indigo-400 font-bold"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2.5 rounded-xl text-slate-500 dark:text-slate-400 transition"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span>More</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <AppContent />
      <ToastContainer />
    </StudyProvider>
  );
}
