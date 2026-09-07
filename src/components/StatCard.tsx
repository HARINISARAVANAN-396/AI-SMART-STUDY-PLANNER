import React from "react";

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    text: string;
    isPositive?: boolean;
  };
  colorScheme?: "indigo" | "emerald" | "amber" | "blue" | "purple";
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon,
  trend,
  colorScheme = "indigo",
}) => {
  const colorMap = {
    indigo: {
      iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
      accent: "text-indigo-600",
    },
    emerald: {
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      accent: "text-emerald-600",
    },
    amber: {
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      accent: "text-amber-600",
    },
    blue: {
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
      accent: "text-blue-600",
    },
    purple: {
      iconBg: "bg-purple-50 text-purple-600 border-purple-100",
      accent: "text-purple-600",
    },
  };

  const scheme = colorMap[colorScheme];

  return (
    <div
      id={id}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${scheme.iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
              trend.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            {trend.text}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
    </div>
  );
};
