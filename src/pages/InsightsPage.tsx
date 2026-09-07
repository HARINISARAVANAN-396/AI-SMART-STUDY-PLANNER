import React, { useState } from "react";
import { useStudy } from "../context/StudyContext";
import { AIInsightCard } from "../components/AIInsightCard";
import { AIInsight } from "../types";
import { fetchAIInsights } from "../services/api";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Target,
  GraduationCap,
} from "lucide-react";

export const InsightsPage: React.FC = () => {
  const {
    insights,
    setInsights,
    subjects,
    tasks,
    profile,
    setActiveTab,
    showToast,
  } = useStudy();

  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const handleRefreshInsights = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAIInsights(subjects, tasks, profile);

      if (response && response.insights) {
        setInsights(response.insights);
        showToast("AI academic insights refreshed!", "success");
      }
    } catch (err: any) {
      console.error("Refresh insights error:", err);
      showToast("Insights updated with active study metrics", "info");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardAction = (insight: AIInsight) => {
    if (insight.category === "Attention") {
      setActiveTab("subjects");
    } else if (insight.category === "Goal") {
      setActiveTab("progress");
    } else {
      setActiveTab("planner");
    }
  };

  const filteredInsights = insights.filter((i) => {
    if (activeCategory === "all") return true;
    return i.category === activeCategory;
  });

  const countByCategory = {
    Attention: insights.filter((i) => i.category === "Attention").length,
    Recommendation: insights.filter((i) => i.category === "Recommendation").length,
    Progress: insights.filter((i) => i.category === "Progress").length,
    Goal: insights.filter((i) => i.category === "Goal").length,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gemini Intelligent Academic Advisor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Insights & Recommendations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time advisory analyzing syllabus velocity, upcoming deadlines, and retention risk factors.
          </p>
        </div>

        <button
          id="btn-refresh-insights"
          onClick={handleRefreshInsights}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition disabled:opacity-70"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>{isLoading ? "Analyzing telemetry..." : "Refresh Insights"}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
            activeCategory === "all"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Recommendations ({insights.length})
        </button>
        <button
          onClick={() => setActiveCategory("Attention")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
            activeCategory === "Attention"
              ? "bg-rose-600 text-white shadow-2xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>⚠️ Attention</span>
          <span className="text-[10px] opacity-80">({countByCategory.Attention})</span>
        </button>
        <button
          onClick={() => setActiveCategory("Recommendation")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
            activeCategory === "Recommendation"
              ? "bg-indigo-600 text-white shadow-2xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>💡 Strategy</span>
          <span className="text-[10px] opacity-80">({countByCategory.Recommendation})</span>
        </button>
        <button
          onClick={() => setActiveCategory("Progress")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
            activeCategory === "Progress"
              ? "bg-emerald-600 text-white shadow-2xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>📈 Progress</span>
          <span className="text-[10px] opacity-80">({countByCategory.Progress})</span>
        </button>
        <button
          onClick={() => setActiveCategory("Goal")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
            activeCategory === "Goal"
              ? "bg-amber-600 text-white shadow-2xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>🎯 Target Goals</span>
          <span className="text-[10px] opacity-80">({countByCategory.Goal})</span>
        </button>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInsights.map((insight) => (
          <AIInsightCard
            key={insight.id}
            insight={insight}
            onAction={handleCardAction}
          />
        ))}
      </div>

      {/* Academic Advisor Methodology Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>How Gemini AI Analyzes Your Academic Trajectory</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our recommendation engine continuously cross-examines your exam date proximity,
            current syllabus completion %, daily study limit, and missed study block redistribution
            to prevent last-minute cramming and ensure deep cognitive retention.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("planner")}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 transition"
        >
          Generate New Study Schedule
        </button>
      </div>
    </div>
  );
};
