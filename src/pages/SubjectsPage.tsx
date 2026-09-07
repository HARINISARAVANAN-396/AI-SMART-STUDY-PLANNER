import React, { useState } from "react";
import { useStudy } from "../context/StudyContext";
import { Subject, DifficultyLevel, PriorityLevel } from "../types";
import { SubjectCard } from "../components/SubjectCard";
import { EmptyState } from "../components/EmptyState";
import { Plus, X, BookOpen, AlertCircle } from "lucide-react";

export const SubjectsPage: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject, resetToDemoData } = useStudy();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Medium");
  const [priority, setPriority] = useState<PriorityLevel>("Medium");
  const [progress, setProgress] = useState<number>(50);
  const [examDate, setExamDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setName("");
    setCode("");
    setDifficulty("Medium");
    setPriority("Medium");
    setProgress(40);
    // Default exam date in 20 days
    const d = new Date();
    d.setDate(d.getDate() + 20);
    setExamDate(d.toISOString().split("T")[0]);
    setNotes("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subj: Subject) => {
    setEditingSubject(subj);
    setName(subj.name);
    setCode(subj.code);
    setDifficulty(subj.difficulty);
    setPriority(subj.priority);
    setProgress(subj.progress);
    setExamDate(subj.examDate || "");
    setNotes(subj.notes || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors = ["#4f46e5", "#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        difficulty,
        priority,
        progress: Number(progress),
        examDate,
        notes: notes.trim(),
      });
    } else {
      addSubject({
        name: name.trim(),
        code: code.trim().toUpperCase() || "SUB101",
        difficulty,
        priority,
        progress: Number(progress),
        examDate,
        notes: notes.trim(),
        color: randomColor,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header & Add Subject Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Subjects
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your courses, monitor mastery levels, and align study priorities.
          </p>
        </div>

        <button
          id="btn-add-subject"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Subject Grid */}
      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subj) => (
            <SubjectCard
              key={subj.id}
              subject={subj}
              onEdit={handleOpenEdit}
              onDelete={deleteSubject}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="subject"
          title="No subjects added yet"
          description="Add your first subject to start building your personalized study plan with Gemini AI."
          actionText="Add Subject"
          onAction={handleOpenAdd}
          secondaryActionText="Load Realistic Demo Subjects"
          onSecondaryAction={resetToDemoData}
        />
      )}

      {/* Add / Edit Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingSubject ? "Edit Subject" : "Add New Subject"}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure difficulty, progress, and upcoming exam deadlines
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Digital Electronics"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="EC301"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Study Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Current Mastery Progress
                  </label>
                  <span className="text-xs font-bold text-indigo-600 font-mono">
                    {progress}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upcoming Exam Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Syllabus / Weak Area Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key topics: Synchronous counters, K-maps, setup & hold times..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition"
                >
                  {editingSubject ? "Save Changes" : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
