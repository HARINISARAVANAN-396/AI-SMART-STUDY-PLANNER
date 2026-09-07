import React from "react";

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = "bg-indigo-600",
  showLabel = false,
  size = "md",
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));

  const heightClass = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  }[size];

  // Dynamic color based on progress if default
  let barColor = color;
  if (color === "dynamic") {
    if (clamped >= 75) barColor = "bg-emerald-500";
    else if (clamped >= 40) barColor = "bg-indigo-500";
    else barColor = "bg-amber-500";
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="font-medium text-slate-500">Mastery</span>
          <span className="font-bold text-slate-800">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${barColor} ${heightClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
