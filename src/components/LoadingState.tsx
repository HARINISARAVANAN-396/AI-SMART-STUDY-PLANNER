import React, { useState, useEffect } from "react";
import { Sparkles, BrainCircuit, Cpu } from "lucide-react";

interface LoadingStateProps {
  title?: string;
  subtitleMessages?: string[];
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = "Creating your personalized study plan...",
  subtitleMessages = [
    "Analyzing syllabus and exam deadlines...",
    "Evaluating subject difficulty and weak areas...",
    "Balancing cognitive load across available daily hours...",
    "Optimizing revision intervals and spaced recall...",
    "Synthesizing high-retention study blocks...",
  ],
}) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % subtitleMessages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [subtitleMessages]);

  return (
    <div className="py-16 px-6 text-center max-w-lg mx-auto flex flex-col items-center justify-center">
      {/* Visual pulse icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 relative z-10">
          <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: "6s" }} />
        </div>
        <div className="absolute inset-0 bg-indigo-400 rounded-2xl animate-ping opacity-25" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
        {title}
      </h3>

      <div className="h-7 flex items-center justify-center">
        <p className="text-sm font-medium text-indigo-600 animate-pulse transition-all">
          {subtitleMessages[msgIndex]}
        </p>
      </div>

      <div className="w-48 bg-slate-100 rounded-full h-1.5 mt-6 overflow-hidden">
        <div className="bg-indigo-600 h-1.5 rounded-full w-2/3 animate-[indeterminate_1.5s_infinite_linear]" />
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Powered by Gemini 3.8 Flash • Aligning schedule with your daily capacity
      </p>
    </div>
  );
};
