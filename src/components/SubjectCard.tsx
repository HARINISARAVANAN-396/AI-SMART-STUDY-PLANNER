import React from "react";
import { Subject } from "../types";
import { ProgressBar } from "./ProgressBar";
import { Calendar, AlertCircle, Edit3, Trash2, BookOpen } from "lucide-react";

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onEdit,
  onDelete,
}) => {
  // Calculate days remaining
  const calculateDaysRemaining = (examDateStr: string) => {
    if (!examDateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(examDateStr);
    examDate.setHours(0, 0, 0, 0);
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining(subject.examDate);

  const difficultyColors = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-blue-50 text-blue-700 border-blue-200",
    Hard: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const priorityColors = {
    Low: "bg-slate-100 text-slate-700 border-slate-200",
    Medium: "bg-blue-50 text-blue-700 border-blue-200",
    High: "bg-amber-50 text-amber-700 border-amber-200",
    Critical: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div
      id={`subject-card-${subject.id}`}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {subject.code || "SUB101"}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                difficultyColors[subject.difficulty]
              }`}
            >
              {subject.difficulty}
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                priorityColors[subject.priority]
              }`}
            >
              {subject.priority}
            </span>
          </div>
        </div>

        {/* Subject Name */}
        <div className="flex items-start gap-2.5 mb-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs"
            style={{ backgroundColor: subject.color || "#4f46e5" }}
          >
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {subject.name}
            </h3>
            {subject.notes && (
              <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                {subject.notes}
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 mb-4">
          <ProgressBar progress={subject.progress} showLabel color="dynamic" size="md" />
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {/* Exam Countdown */}
        <div className="flex items-center gap-1.5 text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {daysRemaining !== null ? (
            <span>
              Exam:{" "}
              <strong
                className={
                  daysRemaining <= 7
                    ? "text-rose-600 font-bold"
                    : daysRemaining <= 18
                    ? "text-amber-600 font-semibold"
                    : "text-slate-800"
                }
              >
                {daysRemaining < 0
                  ? "Past due"
                  : daysRemaining === 0
                  ? "Today!"
                  : `${daysRemaining} days remaining`}
              </strong>
            </span>
          ) : (
            <span>No exam date set</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(subject)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
            title="Edit Subject"
            aria-label="Edit Subject"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(subject.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Delete Subject"
            aria-label="Delete Subject"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
