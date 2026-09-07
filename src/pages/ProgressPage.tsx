import React from "react";
import { useStudy } from "../context/StudyContext";
import { StatCard } from "../components/StatCard";
import { ProgressBar } from "../components/ProgressBar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Calendar,
  BookOpen,
} from "lucide-react";

export const ProgressPage: React.FC = () => {
  const { subjects, tasks, profile, analytics } = useStudy();

  // Completed vs total tasks
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const completionRate = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  // Actual total study time completed (in minutes -> hours)
  const completedMinutes = completedTasks.reduce((acc, t) => acc + t.duration, 0);
  const completedHours = (completedMinutes / 60).toFixed(1);

  // Target hours based on profile
  const targetWeeklyHours = (profile.dailyAvailableHours * (profile.weeklyStudyDays?.length || 6)).toFixed(0);

  // Subject with highest and lowest progress
  const sortedByProgress = [...subjects].sort((a, b) => b.progress - a.progress);
  const mostMastered = sortedByProgress[0];
  const needsAttention = sortedByProgress[sortedByProgress.length - 1];

  // Prepare Subject Mastery Bar Chart data
  const subjectChartData = subjects.map((s) => ({
    name: s.code || s.name.slice(0, 10),
    fullName: s.name,
    progress: s.progress,
    color: s.color || "#4f46e5",
  }));

  // Weekly study hours data (Target vs Actual)
  const weeklyHoursData = analytics.weeklyStudyHours.map((w) => ({
    ...w,
    target: profile.dailyAvailableHours,
  }));

  // Task distribution by type
  const typeCounts: Record<string, number> = {};
  tasks.forEach((t) => {
    typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;
  });

  const pieData = Object.entries(typeCounts).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const PIE_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Progress & Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Quantitative tracking of mastery curves, weekly consistency, and upcoming exam readiness.
        </p>
      </div>

      {/* Top Stat Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Overall Completion Rate"
          value={`${completionRate}%`}
          subtitle={`${completedTasks.length} of ${tasks.length} study blocks finished`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          colorScheme="emerald"
        />

        <StatCard
          title="Actual Study Hours"
          value={`${completedHours} hrs`}
          subtitle={`Weekly goal: ${targetWeeklyHours} hrs`}
          icon={<Clock className="w-5 h-5" />}
          colorScheme="indigo"
        />

        <StatCard
          title="Highest Mastery"
          value={mostMastered ? `${mostMastered.progress}%` : "—"}
          subtitle={mostMastered ? mostMastered.name : "No subjects"}
          icon={<Award className="w-5 h-5" />}
          colorScheme="blue"
        />

        <StatCard
          title="Needs Priority Focus"
          value={needsAttention ? `${needsAttention.progress}%` : "—"}
          subtitle={needsAttention ? `${needsAttention.name} (${needsAttention.difficulty})` : "No subjects"}
          icon={<AlertTriangle className="w-5 h-5" />}
          colorScheme="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Hours Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Weekly Study Consistency (Hours)
              </h3>
              <p className="text-xs text-slate-400">
                Daily actual study hours logged vs daily target threshold
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-3 h-3 rounded-sm bg-indigo-600 inline-block" />
                Actual Hours
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                Target ({profile.dailyAvailableHours}h/day)
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} unit="h" />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [`${value} hours`, "Study Time"]}
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {weeklyHoursData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.hours >= profile.dailyAvailableHours ? "#4f46e5" : "#818cf8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Study Methodology Split
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Distribution of Learning, Practice & Revision
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`slice-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  {item.name}
                </span>
                <span className="font-bold text-slate-900">{item.value} sessions</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject-Wise Mastery Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Subject Mastery Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Exam proximity and current syllabus completion levels
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            {subjects.length} active courses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subj) => {
            const daysLeft = subj.examDate
              ? Math.ceil(
                  (new Date(subj.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )
              : null;

            return (
              <div
                key={subj.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {subj.code}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 truncate max-w-[180px]">
                      {subj.name}
                    </h4>
                  </div>
                  <span className="text-xs font-bold font-mono text-indigo-600">
                    {subj.progress}%
                  </span>
                </div>

                <ProgressBar progress={subj.progress} color="dynamic" size="md" />

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Difficulty: <strong className="text-slate-700">{subj.difficulty}</strong></span>
                  <span>
                    Exam:{" "}
                    <strong className={daysLeft !== null && daysLeft <= 14 ? "text-amber-600" : "text-slate-700"}>
                      {daysLeft !== null ? `${daysLeft} days` : "Unscheduled"}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
