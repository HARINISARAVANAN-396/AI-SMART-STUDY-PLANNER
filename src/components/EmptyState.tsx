import React from "react";
import { BookOpen, Calendar, CheckSquare, Sparkles } from "lucide-react";

interface EmptyStateProps {
  icon?: "subject" | "schedule" | "task" | "ai";
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "subject",
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  const iconMap = {
    subject: <BookOpen className="w-8 h-8 text-indigo-600" />,
    schedule: <Calendar className="w-8 h-8 text-indigo-600" />,
    task: <CheckSquare className="w-8 h-8 text-indigo-600" />,
    ai: <Sparkles className="w-8 h-8 text-indigo-600" />,
  };

  return (
    <div className="bg-white rounded-3xl p-10 border border-slate-200/90 text-center max-w-md mx-auto my-8 shadow-xs flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
        {iconMap[icon]}
      </div>
      <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition"
          >
            {actionText}
          </button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
};
