import React, { useState } from "react";
import { useStudy } from "../context/StudyContext";
import { TaskCard } from "../components/TaskCard";
import { RescheduleModal } from "../components/RescheduleModal";
import { EmptyState } from "../components/EmptyState";
import { StudyTask, StudyType, PriorityLevel } from "../types";
import {
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Search,
} from "lucide-react";

export const TasksPage: React.FC = () => {
  const {
    tasks,
    subjects,
    addTask,
    toggleTaskComplete,
    markTaskMissed,
    deleteTask,
    setActiveTab,
  } = useStudy();

  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "missed">("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rescheduleTask, setRescheduleTask] = useState<StudyTask | null>(null);

  // Add Task Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState<number>(45);
  const [startTime, setStartTime] = useState("06:00 PM");
  const [type, setType] = useState<StudyType>("Learning");
  const [priority, setPriority] = useState<PriorityLevel>("Medium");
  const [day, setDay] = useState("Monday");

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (subjectFilter !== "all" && task.subjectId !== subjectFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTopic = task.topic.toLowerCase().includes(q);
      const matchSubj = task.subjectName.toLowerCase().includes(q);
      if (!matchTopic && !matchSubj) return false;
    }
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const selectedSubj = subjects.find((s) => s.id === subjectId) || subjects[0];
    const todayStr = new Date().toISOString().split("T")[0];

    addTask({
      subjectId: selectedSubj?.id || "custom",
      subjectName: selectedSubj?.name || "Independent Study",
      subjectCode: selectedSubj?.code || "GEN",
      topic: topic.trim(),
      day,
      date: todayStr,
      startTime,
      duration: Number(duration),
      type,
      priority,
      status: "pending",
    });

    setIsAddModalOpen(false);
    setTopic("");
  };

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const missedCount = tasks.filter((t) => t.status === "missed").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Task Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track individual study sessions, practice modules, and smart rescheduling.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === "all"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === "pending"
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === "completed"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setStatusFilter("missed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === "missed"
                ? "bg-amber-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Missed ({missedCount})
          </button>
        </div>

        {/* Search & Subject Select */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-40 sm:w-48"
            />
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={toggleTaskComplete}
              onMarkMissed={markTaskMissed}
              onReschedule={(t) => setRescheduleTask(t)}
              onDelete={deleteTask}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="task"
          title="No tasks match your filters"
          description={
            statusFilter === "missed"
              ? "Great job! You have no missed study sessions."
              : "No study tasks found. Generate an AI study plan or add a custom task."
          }
          actionText={statusFilter !== "all" ? "Clear Filters" : "Generate Plan"}
          onAction={
            statusFilter !== "all"
              ? () => {
                  setStatusFilter("all");
                  setSubjectFilter("all");
                  setSearchQuery("");
                }
              : () => setActiveTab("planner")
          }
        />
      )}

      {/* Add Custom Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Study Task</h3>
            <p className="text-xs text-slate-500 mb-5">
              Create a custom focus block in your schedule
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Topic / Goal *
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Solve 5 problems on Dynamic Programming"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Day
                  </label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                      (d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="06:00 PM"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    step="15"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as StudyType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  >
                    <option value="Learning">Learning</option>
                    <option value="Practice">Practice</option>
                    <option value="Revision">Revision</option>
                    <option value="Mock Test">Mock Test</option>
                    <option value="Weak Area Review">Weak Area Review</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
                >
                  Add Task
                </button>
              </div>
            </form>
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
