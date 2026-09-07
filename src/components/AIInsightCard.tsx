import React from "react";
import { AIInsight } from "../types";
import { AlertTriangle, Lightbulb, TrendingUp, Target, ArrowRight } from "lucide-react";

interface AIInsightCardProps {
  insight: AIInsight;
  onAction?: (insight: AIInsight) => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight, onAction }) => {
  const categoryConfig = {
    Attention: {
      badge: "⚠️ Attention",
      bg: "bg-rose-50/50 hover:bg-rose-50/80 border-rose-200/80",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      icon: <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />,
      btnColor: "bg-rose-600 hover:bg-rose-700 text-white",
    },
    Recommendation: {
      badge: "💡 Recommendation",
      bg: "bg-indigo-50/50 hover:bg-indigo-50/80 border-indigo-200/80",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
      icon: <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0" />,
      btnColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
    },
    Progress: {
      badge: "📈 Progress",
      bg: "bg-emerald-50/50 hover:bg-emerald-50/80 border-emerald-200/80",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />,
      btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    Goal: {
      badge: "🎯 Goal",
      bg: "bg-amber-50/50 hover:bg-amber-50/80 border-amber-200/80",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      icon: <Target className="w-5 h-5 text-amber-600 shrink-0" />,
      btnColor: "bg-amber-600 hover:bg-amber-700 text-white",
    },
  };

  const config = categoryConfig[insight.category] || categoryConfig.Recommendation;

  return (
    <div
      id={`ai-insight-${insight.id}`}
      className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between shadow-2xs ${config.bg}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${config.badgeColor}`}
          >
            {config.badge}
          </span>
          {config.icon}
        </div>

        <h4 className="text-base font-bold text-slate-900 leading-snug mb-1.5">
          {insight.title}
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          {insight.description}
        </p>
      </div>

      {insight.actionText && (
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">AI Advisory</span>
          <button
            onClick={() => onAction && onAction(insight)}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition"
          >
            <span>{insight.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
