import React, { useState } from "react";
import { useStudy } from "../context/StudyContext";
import { RescheduleModal } from "../components/RescheduleModal";
import { EmptyState } from "../components/EmptyState";
import { StudyTask } from "../types";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  Check,
  AlertTriangle,
  RotateCcw,
  Play,
  Layers,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const {
    profile,
    subjects,
    tasks,
    insights,
    toggleTaskComplete,
    markTaskMissed,
    setActiveTab,
    startFocusMode,
  } = useStudy();

  const [rescheduleTask, setRescheduleTask] = useState<StudyTask | null>(null);

  // Dynamic greeting based on current hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  // Today's date string
  const todayStr = new Date().toISOString().split("T")[0];

  // Filter today's tasks (or fallback to day matches)
  const todaysTasks = tasks.filter((t) => t.date === todayStr || (!t.date && t.day === "Monday"));
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const todayCompletedCount = todaysTasks.filter((t) => t.status === "completed").length;

  // Top 3 most important tasks for "Today's Focus"
  const topFocusTasks = todaysTasks.slice(0, 3);

  // Calculate stats
  const overallProgress =
    subjects.length > 0
      ? Math.round(subjects.reduce((sum, s) => sum + (s.progress || 0), 0) / subjects.length)
      : 72;

  const totalStudyMinutes = profile.totalStudyMinutes || 135;
  const studyHours = Math.floor(totalStudyMinutes / 60);
  const studyMins = totalStudyMinutes % 60;
  const studyTimeString = `${studyHours}h ${studyMins > 0 ? `${studyMins}m` : ""}`.trim() || "2h 15m";

  // Remaining today duration
  const remainingTodayMinutes = todaysTasks
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + (t.duration || 45), 0);
  const remainingHours = Math.floor(remainingTodayMinutes / 60);
  const remainingMins = remainingTodayMinutes % 60;
  const remainingTimeString =
    remainingTodayMinutes > 0
      ? `${remainingHours > 0 ? `${remainingHours}h ` : ""}${remainingMins}m`
      : "Completed for today";

  // Top priority subject
  const topPrioritySubject =
    [...subjects].sort((a, b) => (b.priority === "Critical" ? 2 : 1) - (a.priority === "Critical" ? 2 : 1))[0]?.name ||
    "Mathematics";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {greeting}, {profile.name.split(" ")[0] || "Student"} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's your plan for today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => startFocusMode()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Focus Mode</span>
          </button>

          <button
            onClick={() => setActiveTab("planner")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Planner</span>
          </button>
        </div>
      </div>

      {/* Visually Sophisticated Top Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Overall Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Overall Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {overallProgress}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Study Time */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Study Time
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {studyTimeString}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Target: {profile.dailyAvailableHours || 3.5}h daily
          </p>
        </div>

        {/* Metric 3: Tasks */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tasks
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {todayCompletedCount} / {todaysTasks.length || 7}
          </div>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {Math.round((todayCompletedCount / (todaysTasks.length || 1)) * 100)}% daily rate
          </p>
        </div>

        {/* Metric 4: Streak */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Streak
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center text-xs font-bold">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono flex items-center gap-1.5">
            <span>{profile.streakDays || 8}</span>
            <span className="text-lg font-bold text-slate-400 dark:text-slate-500">days</span>
          </div>
          <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Consistent learning streak!
          </p>
        </div>
      </div>

      {/* AI DAILY BRIEF SECTION */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-950/20 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Your AI Brief</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug max-w-2xl">
            You have {todaysTasks.filter((t) => t.status === "pending").length} focused sessions today.
            Your highest priority is <span className="text-indigo-300 underline decoration-indigo-400 underline-offset-4">{topPrioritySubject}</span> because its deadline is approaching.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-700/60">
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400">Today's Priority</div>
              <div className="text-sm font-bold text-white mt-0.5">{topPrioritySubject}</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400">Recommended Focus</div>
              <div className="text-sm font-bold text-indigo-300 mt-0.5">Active Problem Sets</div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400">Remaining Study Time</div>
              <div className="text-sm font-bold text-white mt-0.5">{remainingTimeString}</div>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S FOCUS SECTION (Large section showing top 3 most important tasks) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Today's Focus
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {topFocusTasks.length} Key Sessions
            </span>
          </div>

          <button
            onClick={() => setActiveTab("tasks")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 transition"
          >
            <span>View All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {topFocusTasks.length === 0 ? (
          <EmptyState
            title="No tasks scheduled for today"
            description="Generate a smart study plan or add a topic to populate today's schedule."
            actionLabel="Generate AI Plan"
            onAction={() => setActiveTab("planner")}
          />
        ) : (
          <div className="space-y-3.5">
            {topFocusTasks.map((task, idx) => {
              const isCompleted = task.status === "completed";
              const isMissed = task.status === "missed";

              return (
                <div
                  key={task.id}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCompleted
                      ? "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80"
                      : isMissed
                      ? "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60"
                      : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-800"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox with completion animation */}
                    <button
                      type="button"
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`w-7 h-7 mt-0.5 rounded-xl border flex items-center justify-center transition-all duration-200 ${
                        isCompleted
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                          : "border-slate-300 dark:border-slate-600 hover:border-indigo-500 bg-white dark:bg-slate-800"
                      }`}
                      aria-label="Toggle task completion"
                    >
                      {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                          {task.startTime}
                        </span>
                        <span className="font-bold text-xs text-slate-500 dark:text-slate-400">
                          {task.subjectName}
                        </span>
                        {task.priority === "Critical" && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
                            URGENT
                          </span>
                        )}
                        {task.priority === "High" && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                            HIGH PRIORITY
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-base font-extrabold text-slate-900 dark:text-white ${
                          isCompleted ? "line-through text-slate-400 dark:text-slate-500" : ""
                        }`}
                      >
                        {task.topic}
                      </h3>

                      {task.reason && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                          {task.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right side controls: duration, focus mode button, missed button */}
                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                      {task.duration} min
                    </span>

                    {!isCompleted && !isMissed && (
                      <>
                        <button
                          type="button"
                          onClick={() => startFocusMode(task)}
                          className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Start Focus Timer on this topic"
                        >
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                        <button
                          type="button"
                          onClick={() => markTaskMissed(task.id)}
                          className="px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition"
                        >
                          Missed?
                        </button>
                      </>
                    )}

                    {isMissed && (
                      <button
                        type="button"
                        onClick={() => setRescheduleTask(task)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Let AI Reschedule</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleTask && (
        <RescheduleModal
          missedTask={rescheduleTask}
          onClose={() => setRescheduleTask(null)}
        />
      )}
    </div>
  );
};
