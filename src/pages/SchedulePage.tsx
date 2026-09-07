import React, { useState } from "react";
import { useStudy } from "../context/StudyContext";
import { TaskCard } from "../components/TaskCard";
import { RescheduleModal } from "../components/RescheduleModal";
import { EmptyState } from "../components/EmptyState";
import { StudyTask } from "../types";
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

export const SchedulePage: React.FC = () => {
  const {
    tasks,
    subjects,
    toggleTaskComplete,
    markTaskMissed,
    setActiveTab,
  } = useStudy();

  const [viewMode, setViewMode] = useState<"weekly" | "daily">("weekly");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");
  const [rescheduleTask, setRescheduleTask] = useState<StudyTask | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedSubjectFilter === "all") return true;
    return t.subjectId === selectedSubjectFilter || t.subjectName === selectedSubjectFilter;
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Helper to map date to day of week
  const getDayForTask = (task: StudyTask): string => {
    if (task.day) return task.day;
    if (task.date) {
      const d = new Date(task.date + "T00:00:00");
      const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return names[d.getDay()];
    }
    return "Monday";
  };

  // Group tasks by day
  const tasksByDay: Record<string, StudyTask[]> = {};
  daysOfWeek.forEach((d) => {
    tasksByDay[d] = [];
  });

  filteredTasks.forEach((task) => {
    const day = getDayForTask(task);
    if (tasksByDay[day]) {
      tasksByDay[day].push(task);
    } else {
      tasksByDay["Monday"].push(task);
    }
  });

  // For daily view, select current day (defaults to Monday or current day of week)
  const currentDayIndex = new Date().getDay(); // 0 is Sunday
  const currentDayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentDayIndex];
  const [activeDay, setActiveDay] = useState<string>(
    daysOfWeek.includes(currentDayName) ? currentDayName : "Monday"
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Study Schedule
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize sessions across days with balanced workload distribution.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter by Subject */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-hidden text-slate-700 font-medium"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle (Weekly / Daily) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                viewMode === "weekly"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Weekly Grid
            </button>
            <button
              onClick={() => setViewMode("daily")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                viewMode === "daily"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Daily View
            </button>
          </div>

          <button
            onClick={() => setActiveTab("planner")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Plan</span>
          </button>
        </div>
      </div>

      {/* Main View */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon="schedule"
          title="No scheduled study sessions"
          description="Your calendar is clear. Use the AI Study Planner to populate your timetable with optimized study sessions."
          actionText="Generate AI Schedule"
          onAction={() => setActiveTab("planner")}
        />
      ) : viewMode === "weekly" ? (
        /* Weekly Calendar Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 items-start">
          {daysOfWeek.map((day) => {
            const dayTasks = tasksByDay[day] || [];
            const dayTotalMinutes = dayTasks.reduce((sum, t) => sum + t.duration, 0);
            const isToday = day === currentDayName;

            return (
              <div
                key={day}
                className={`rounded-2xl p-4 border transition-all flex flex-col min-h-[300px] ${
                  isToday
                    ? "bg-indigo-50/40 border-indigo-300 ring-1 ring-indigo-200"
                    : "bg-white border-slate-200/90 shadow-2xs"
                }`}
              >
                {/* Column Day Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div>
                    <h3
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isToday ? "text-indigo-700" : "text-slate-800"
                      }`}
                    >
                      {day.slice(0, 3)}
                      {isToday && (
                        <span className="ml-1 text-[10px] font-normal text-indigo-600">
                          (Today)
                        </span>
                      )}
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">
                    {dayTotalMinutes > 0 ? `${dayTotalMinutes}m` : "0m"}
                  </span>
                </div>

                {/* Task items for the day */}
                <div className="space-y-2.5 flex-1">
                  {dayTasks.length > 0 ? (
                    dayTasks.map((t) => {
                      const isCompleted = t.status === "completed";
                      const isMissed = t.status === "missed";
                      return (
                        <div
                          key={t.id}
                          onClick={() => toggleTaskComplete(t.id)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition text-left relative group ${
                            isCompleted
                              ? "bg-slate-50 border-slate-200 opacity-60"
                              : isMissed
                              ? "bg-amber-50 border-amber-200"
                              : "bg-white border-slate-200 hover:border-indigo-300 shadow-2xs"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold text-indigo-700 truncate max-w-[90px]">
                              {t.subjectName}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {t.startTime}
                            </span>
                          </div>
                          <p
                            className={`text-xs font-semibold leading-tight line-clamp-2 ${
                              isCompleted ? "line-through text-slate-400" : "text-slate-900"
                            }`}
                          >
                            {t.topic}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                            <span>{t.duration}m</span>
                            <span
                              className={`px-1 py-0.2 rounded text-[9px] font-medium ${
                                t.type === "Practice"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : t.type === "Revision"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-indigo-50 text-indigo-700"
                              }`}
                            >
                              {t.type}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex items-center justify-center text-center p-3 text-slate-300 text-xs">
                      No study sessions
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Daily View */
        <div className="space-y-6">
          {/* Day selection tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition shrink-0 ${
                  activeDay === day
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {day} ({(tasksByDay[day] || []).length})
              </button>
            ))}
          </div>

          {/* Sessions list for active day */}
          <div className="space-y-3">
            {(tasksByDay[activeDay] || []).length > 0 ? (
              tasksByDay[activeDay].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskComplete}
                  onMarkMissed={markTaskMissed}
                  onReschedule={(t) => setRescheduleTask(t)}
                />
              ))
            ) : (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center text-slate-500 text-sm">
                No study sessions scheduled for {activeDay}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTask && (
        <RescheduleModal
          task={rescheduleTask}
          onClose={() => setRescheduleTask(null)}
        />
      )}
    </div>
  );
};
