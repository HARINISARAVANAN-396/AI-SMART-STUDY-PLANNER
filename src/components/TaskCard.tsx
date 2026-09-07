import React from "react";
import { StudyTask } from "../types";
import { Check, Clock, AlertCircle, RefreshCw, Trash2, Calendar } from "lucide-react";

interface TaskCardProps {
  task: StudyTask;
  onToggleComplete: (id: string) => void;
  onMarkMissed?: (id: string) => void;
  onReschedule?: (task: StudyTask) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onMarkMissed,
  onReschedule,
  onDelete,
  compact = false,
}) => {
  const isCompleted = task.status === "completed";
  const isMissed = task.status === "missed";

  const priorityBadgeColors = {
    Low: "bg-slate-100 text-slate-700",
    Medium: "bg-blue-50 text-blue-700 border-blue-200",
    High: "bg-amber-50 text-amber-700 border-amber-200",
    Critical: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const typeBadgeColors = {
    Learning: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Practice: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Revision: "bg-amber-50 text-amber-700 border-amber-200",
    "Mock Test": "bg-purple-50 text-purple-700 border-purple-200",
    "Weak Area Review": "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div
      id={`task-item-${task.id}`}
      className={`rounded-2xl p-4 border transition-all duration-200 ${
        isCompleted
          ? "bg-slate-50/80 border-slate-200 opacity-80"
          : isMissed
          ? "bg-amber-50/40 border-amber-200 shadow-2xs"
          : "bg-white border-slate-200/90 shadow-2xs hover:border-slate-300"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox button */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition shrink-0 mt-0.5 ${
            isCompleted
              ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
              : "border-slate-300 hover:border-indigo-500 bg-white"
          }`}
          title={isCompleted ? "Mark as pending" : "Mark as completed"}
          aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
        >
          {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                isCompleted ? "bg-slate-200 text-slate-600" : "bg-indigo-50 text-indigo-700 font-medium"
              }`}
            >
              {task.subjectName}
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                typeBadgeColors[task.type] || "bg-slate-100 text-slate-600"
              }`}
            >
              {task.type}
            </span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                priorityBadgeColors[task.priority]
              }`}
            >
              {task.priority}
            </span>
            {isMissed && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Missed
              </span>
            )}
          </div>

          <h4
            className={`text-sm font-bold leading-snug ${
              isCompleted ? "line-through text-slate-500 font-medium" : "text-slate-900"
            }`}
          >
            {task.topic}
          </h4>

          {/* Time & Duration */}
          <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {task.startTime} {task.endTime ? `– ${task.endTime}` : ""}
            </span>
            <span className="font-medium text-slate-700">
              {task.duration} minutes
            </span>
            {task.day && (
              <span className="text-slate-400 hidden sm:inline">
                {task.day}
              </span>
            )}
          </div>

          {/* AI Reason explanation */}
          {task.reason && !compact && (
            <p className="text-[11px] text-slate-500 mt-1.5 italic bg-slate-50/80 p-2 rounded-lg border border-slate-100">
              💡 {task.reason}
            </p>
          )}

          {/* Reschedule banner for missed tasks */}
          {isMissed && onReschedule && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Session was missed. AI can redistribute it safely.</span>
              </div>
              <button
                onClick={() => onReschedule(task)}
                className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-lg shadow-2xs flex items-center gap-1.5 shrink-0 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reschedule with AI
              </button>
            </div>
          )}
        </div>

        {/* Card actions */}
        <div className="flex items-center gap-1 shrink-0">
          {!isCompleted && !isMissed && onMarkMissed && (
            <button
              onClick={() => onMarkMissed(task.id)}
              className="text-xs text-slate-400 hover:text-amber-600 hover:bg-amber-50 px-2 py-1 rounded-md transition"
              title="Mark as missed"
            >
              I Missed This
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Remove task"
              aria-label="Remove task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
