import React, { useState, useEffect } from "react";
import { useStudy } from "../context/StudyContext";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  BarChart3,
  TrendingUp,
  BrainCircuit,
  Flame,
  ShieldCheck,
  Check,
  Zap,
  RotateCcw,
  MessageSquare,
  Moon,
  Sun,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const { setActiveTab, darkMode, toggleDarkMode } = useStudy();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Sticky Translucent Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Logo Concept: Flowing path combined with an AI sparkle */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 group-hover:scale-105 transition transform">
              {/* Flowing path SVG with sparkle */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-none stroke-current stroke-[2.2]"
              >
                <path
                  d="M4 16c2-4 5-6 8-6s6 3 8 2"
                  strokeLinecap="round"
                />
                <circle cx="18" cy="8" r="2" fill="white" />
                <path d="M12 4v2m0 12v2M4 12H2m20 0h-2" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  StudyFlow
                </span>
                <span className="text-[11px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Study smarter. Make every hour count.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("ai-showcase")}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              AI Planner
            </button>
            <button
              onClick={() => scrollToSection("insights-section")}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Insights
            </button>
          </nav>

          {/* Right CTAs & Dark Mode toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setActiveTab("login")}
              className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3.5 py-2 rounded-xl transition"
            >
              Log In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className="text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition flex items-center gap-1.5 transform hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-12 sm:pt-20 pb-20 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Hero Typography & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide">
              <span>✦</span>
              <span>AI-POWERED STUDY PLANNER</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.12]">
              Your goals deserve <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                a smarter plan.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal">
              StudyFlow AI transforms your goals, deadlines, available time, and learning priorities into a personalized study routine that adapts as you progress.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <button
                id="hero-create-plan-cta"
                onClick={() => setActiveTab("onboarding")}
                className="px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-extrabold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
              >
                <span>Create My Study Plan →</span>
              </button>
              <button
                onClick={() => setActiveTab("planner")}
                className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold transition flex items-center justify-center shadow-2xs"
              >
                Explore the Planner
              </button>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Plan less. Learn more. Stay consistent.</span>
            </div>
          </div>

          {/* Right Column: Hero Visual - Floating Product Interface */}
          <div className="lg:col-span-6 relative">
            {/* Subtle glow background */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-transparent rounded-3xl blur-2xl -z-10" />

            {/* Dashboard Mockup Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-2xl shadow-slate-300/40 dark:shadow-none space-y-6 relative overflow-hidden">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-extrabold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                    TODAY'S FOCUS
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Optimized</span>
                </div>
              </div>

              {/* Exact Requested Today's Focus Sessions */}
              <div className="space-y-3">
                {/* 1. Mathematics */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">08:00 AM</span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">Mathematics</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Algebra Practice • 45 min</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                    Completed
                  </span>
                </div>

                {/* 2. Physics */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 ring-2 ring-indigo-500/10 shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-200 dark:border-indigo-800 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">10:30 AM</span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">Physics</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Concept Revision • 60 min</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg">
                    High Priority
                  </span>
                </div>

                {/* 3. Programming */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">05:30 PM</span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">Programming</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Problem Solving • 45 min</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Practice
                  </span>
                </div>

                {/* 4. Quick Review */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">07:00 PM</span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">Quick Review</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Spaced Recalls • 30 min</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Revision
                  </span>
                </div>
              </div>

              {/* Floating AI Insight Bubble & Progress Ring Overlay */}
              <div className="pt-2 flex items-center justify-between gap-4 p-3 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-transparent border border-indigo-200/60 dark:border-indigo-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    ✦
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      AI Insight: Physics Deadline Approaching
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Physics received +30m practice today to solidify weak mechanics topics.
                    </p>
                  </div>
                </div>

                {/* Progress Ring Visual */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">72%</div>
                    <div className="text-[10px] text-slate-400">Today</div>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin-slow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / VALUE SECTION */}
      <section className="border-y border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built around how you actually learn.
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Engineered with cognitive science principles: active recall, spaced repetition, and burnout safety limits.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">✦</span>
              <span>Personalized</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">✦</span>
              <span>AI-powered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">✦</span>
              <span>Adaptive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">✦</span>
              <span>Progress-aware</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION: 6 visually distinctive feature sections */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Core Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Everything you need to study with purpose.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Not a passive timetable. StudyFlow is an active intelligence engine that manages your workload, prioritizes your deadlines, and keeps you moving forward.
          </p>
        </div>

        {/* Feature Grid with varied, distinctive card layouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* FEATURE 1: AI Study Planning */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Study Planning</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              "Tell us what you're learning. AI builds a realistic plan around your time and goals."
            </p>
            {/* Visual preview */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs font-mono space-y-1.5">
              <div className="text-indigo-600 dark:text-indigo-400 font-bold flex justify-between">
                <span>08:00 AM • Practice</span>
                <span>45m</span>
              </div>
              <div className="text-slate-700 dark:text-slate-300 font-sans font-semibold">
                Mathematics: Eigenvalues & Vector Space
              </div>
            </div>
          </div>

          {/* FEATURE 2: Smart Prioritization */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Smart Prioritization</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              "Know what deserves your attention first."
            </p>
            {/* Visual priority bars */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Physics (Exam in 10d)</span>
                <span className="text-rose-600 font-bold">Critical</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="w-4/5 h-full bg-rose-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* FEATURE 3: Adaptive Scheduling */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Adaptive Scheduling</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              "Missed a session? Your plan adjusts automatically."
            </p>
            {/* Visual before -> after animation card */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
              <div className="text-slate-400 line-through">Today 05:00 PM • Missed</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span>→ Rescheduled to Tomorrow 06:00 PM</span>
              </div>
            </div>
          </div>

          {/* FEATURE 4: Progress Intelligence */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Progress Intelligence</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              "Understand where you're improving and where you need more focus."
            </p>
            {/* Analytics mini bars */}
            <div className="flex items-end gap-1.5 h-12 pt-2">
              <div className="flex-1 bg-indigo-200 dark:bg-indigo-900/60 rounded-t h-1/2" />
              <div className="flex-1 bg-indigo-300 dark:bg-indigo-800 rounded-t h-3/4" />
              <div className="flex-1 bg-indigo-500 dark:bg-indigo-600 rounded-t h-full" />
              <div className="flex-1 bg-indigo-600 dark:bg-indigo-500 rounded-t h-5/6" />
            </div>
          </div>

          {/* FEATURE 5: AI Insights */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Insights</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              "Get personalized recommendations based on your actual study behavior."
            </p>
            <div className="p-3 bg-violet-50/50 dark:bg-violet-950/40 rounded-2xl border border-violet-200 dark:border-violet-900/60 text-xs text-violet-900 dark:text-violet-200 font-medium">
              "You retain 28% more concept details during morning sessions."
            </div>
          </div>

          {/* FEATURE 6: Focus Mode */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Focus Mode</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              "Remove distractions and focus on one thing at a time."
            </p>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">25:00</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Active Session
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 sm:py-28 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Four-Stage Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              How StudyFlow Works
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              From your initial learning goals to daily execution and automated schedule resilience.
            </p>
          </div>

          {/* 4 Stages with subtle connecting line */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stage 1 */}
            <div className="space-y-4 relative z-10 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Define
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tell StudyFlow what you want to achieve. Exam preparation, competitive tests, or mastering professional topics.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="space-y-4 relative z-10 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Plan
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Add your topics, deadlines, confidence ratings, and available daily hours.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="space-y-4 relative z-10 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Optimize
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Gemini creates your personalized plan, calculating realistic workloads without overloading you.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="space-y-4 relative z-10 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                04
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Adapt
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Track progress, complete sessions in Focus Mode, and let AI automatically redistribute missed tasks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI SHOWCASE SECTION */}
      <section id="ai-showcase" className="py-20 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Intelligent Academic Strategist
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Not just a timetable. <br />
            <span className="text-indigo-600 dark:text-indigo-400">
              Your personal AI study strategist.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg shadow-slate-200/50 dark:shadow-none">
          {/* Left Side: Realistic AI Conversation UI */}
          <div className="lg:col-span-7 space-y-4 bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            {/* User Message */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                You
              </div>
              <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 font-medium">
                "I have 12 days before my exams and four topics left."
              </div>
            </div>

            {/* AI Response */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                ✦
              </div>
              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/50 rounded-2xl rounded-tl-none border border-indigo-200 dark:border-indigo-800 text-sm text-slate-800 dark:text-slate-200 space-y-3">
                <p className="font-semibold text-indigo-950 dark:text-indigo-200">
                  "I've analyzed your deadlines, confidence levels and available study time."
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Here is how I structured your optimal preparation trajectory:
                </p>

                {/* Bullets */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Priority-based plan</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Daily revision</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Practice sessions</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Balanced workload</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Buffer time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Explanatory Content */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              StudyFlow understands your situation and builds a plan around your reality.
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Traditional calendars fail because life happens. When you miss a class, feel fatigued, or fall behind on a difficult topic, StudyFlow doesn't penalize you—it recalculates.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab("onboarding")}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition flex items-center gap-2"
              >
                <span>Try the AI Strategist Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              ✦
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                StudyFlow AI
              </span>
              <p className="text-xs text-slate-400">
                Study smarter. Make every hour count.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <button onClick={() => setActiveTab("landing")} className="hover:text-slate-900 dark:hover:text-white">
              Home
            </button>
            <button onClick={() => setActiveTab("login")} className="hover:text-slate-900 dark:hover:text-white">
              Log In
            </button>
            <button onClick={() => setActiveTab("signup")} className="hover:text-slate-900 dark:hover:text-white">
              Sign Up
            </button>
            <button onClick={() => setActiveTab("dashboard")} className="hover:text-slate-900 dark:hover:text-white">
              Dashboard
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
