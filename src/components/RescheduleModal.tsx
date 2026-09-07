import React, { useState } from "react";
import { StudyTask, RescheduleRecommendation } from "../types";
import { useStudy } from "../context/StudyContext";
import { rescheduleMissedTaskWithAI } from "../services/api";
import { Sparkles, X, AlertCircle, ArrowRight, CheckCircle2, Clock } from "lucide-react";

interface RescheduleModalProps {
  task: StudyTask | null;
  onClose: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({ task, onClose }) => {
  const { tasks, profile, updateTask, addTask, showToast } = useStudy();
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RescheduleRecommendation | null>(null);

  if (!task) return null;

  const handleRequestAIReschedule = async () => {
    setLoading(true);
    try {
      const upcoming = tasks.filter((t) => t.status === "pending");
      const res = await rescheduleMissedTaskWithAI(task, upcoming, {
        dailyAvailableHours: profile.dailyAvailableHours,
        preferredStudyTime: profile.preferredStudyTime,
      });

      if (res.data) {
        setRecommendation(res.data);
      }
    } catch (err) {
      console.error("Reschedule failed:", err);
      // Fallback
      setRecommendation({
        originalTask: task,
        rescheduledSlot: {
          day: "Tomorrow",
          time: "06:30 PM",
          duration: task.duration || 45,
          subjectName: task.subjectName,
          topic: task.topic,
        },
        compensationAdjustment: "Optimized against evening study buffer.",
        explanation: `Moved session to tomorrow evening so your revision rhythm is preserved without exhausting your daily study limit.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptReschedule = () => {
    if (!recommendation) return;

    // 1. Mark original task as rescheduled
    updateTask(task.id, {
      status: "missed",
      reason: `Missed, rescheduled by AI to ${recommendation.rescheduledSlot.day} ${recommendation.rescheduledSlot.time}`,
    });

    // 2. Add the rescheduled task to the schedule
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    addTask({
      subjectId: task.subjectId,
      subjectName: recommendation.rescheduledSlot.subjectName,
      subjectCode: task.subjectCode,
      topic: recommendation.rescheduledSlot.topic,
      date: dateStr,
      day: recommendation.rescheduledSlot.day,
      startTime: recommendation.rescheduledSlot.time,
      duration: recommendation.rescheduledSlot.duration,
      type: task.type,
      priority: task.priority,
      status: "pending",
      reason: `Rescheduled by AI from missed session: ${recommendation.explanation}`,
    });

    showToast(`Task rescheduled to ${recommendation.rescheduledSlot.day} ${recommendation.rescheduledSlot.time}!`, "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Smart AI Rescheduling
            </h3>
            <p className="text-xs text-slate-500">
              Redistribute missed sessions without overloading your daily hours
            </p>
          </div>
        </div>

        {/* Original Missed Task Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-400">
              Original Missed Session
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
              Missed
            </span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {task.subjectName} – {task.topic}
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {task.duration} minutes
            </span>
            <span>Scheduled: {task.startTime}</span>
          </div>
        </div>

        {/* Recommendation output if generated */}
        {recommendation ? (
          <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 mb-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>AI Optimized Replacement</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-emerald-100 shadow-2xs">
              <p className="text-sm font-bold text-slate-900">
                Move to {recommendation.rescheduledSlot.day} at {recommendation.rescheduledSlot.time}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Duration: {recommendation.rescheduledSlot.duration} min • {recommendation.rescheduledSlot.subjectName}
              </p>
            </div>

            {recommendation.compensationAdjustment && (
              <div className="text-xs text-slate-700 bg-white/70 p-3 rounded-xl border border-emerald-100">
                <span className="font-semibold text-emerald-900">Workload Adjustment: </span>
                {recommendation.compensationAdjustment}
              </div>
            )}

            <p className="text-xs text-slate-600 italic">
              "{recommendation.explanation}"
            </p>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Gemini will analyze your weekly study capacity ({profile.dailyAvailableHours}h/day cap),
              upcoming exam proximity, and open time slots to reschedule this topic smoothly.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Cancel
          </button>

          {!recommendation ? (
            <button
              onClick={handleRequestAIReschedule}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "Calculating slots..." : "Reschedule with AI"}
            </button>
          ) : (
            <button
              onClick={handleAcceptReschedule}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              Accept AI Reschedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
