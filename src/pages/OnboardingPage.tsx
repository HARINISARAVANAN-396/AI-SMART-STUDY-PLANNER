import React, { useState } from "react";
import { useStudy } from "../context/StudyContext";
import {
  Target,
  BookOpen,
  Calendar,
  Clock,
  SunMedium,
  ArrowRight,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { getFormattedDate } from "../data/mockData";
import { Subject } from "../types";

export const OnboardingPage: React.FC = () => {
  const { profile, updateProfile, subjects, addSubject, setActiveTab, showToast } = useStudy();

  const [step, setStep] = useState<number>(1);

  // Step 1: Goal
  const goalOptions = [
    "Exam preparation",
    "Learn a skill",
    "Certification",
    "Academic improvement",
    "Personal goal",
  ];
  const [selectedGoal, setSelectedGoal] = useState<string>(profile.learningGoal || "Exam preparation");
  const [customGoal, setCustomGoal] = useState<string>("");

  // Step 2: Topics
  const [initialTopics, setInitialTopics] = useState<Array<{ name: string; difficulty: "Easy" | "Medium" | "Hard"; confidence: "Low" | "Medium" | "High" }>>([
    { name: "Mathematics", difficulty: "Hard", confidence: "Medium" },
    { name: "Programming & Algorithms", difficulty: "Hard", confidence: "Medium" },
    { name: "Physics", difficulty: "Hard", confidence: "Low" },
  ]);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDifficulty, setNewTopicDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");

  // Step 3: Target Date
  const [targetDate, setTargetDate] = useState<string>(getFormattedDate(30));

  // Step 4: Available Daily Hours
  const [dailyHours, setDailyHours] = useState<number>(profile.dailyAvailableHours || 3.5);

  // Step 5: Preferred Study Time
  const studyTimeOptions = [
    { label: "Morning", desc: "07:00 AM – 12:00 PM (Sharp focus, early start)" },
    { label: "Afternoon", desc: "12:00 PM – 05:00 PM (Steady mid-day study)" },
    { label: "Evening", desc: "05:00 PM – 10:00 PM (Deep focus after classes/work)" },
    { label: "Flexible", desc: "Balanced morning & evening sessions" },
  ];
  const [preferredTime, setPreferredTime] = useState<string>("Flexible");

  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;
    setInitialTopics((prev) => [
      ...prev,
      { name: newTopicName.trim(), difficulty: newTopicDifficulty, confidence: "Medium" },
    ]);
    setNewTopicName("");
  };

  const handleRemoveTopic = (idx: number) => {
    if (initialTopics.length > 1) {
      setInitialTopics((prev) => prev.filter((_, i) => i !== idx));
    } else {
      showToast("Please keep at least one study topic", "warning");
    }
  };

  const handleFinishOnboarding = () => {
    const finalGoal = customGoal.trim() || selectedGoal;

    // Save profile preferences
    updateProfile({
      learningGoal: finalGoal,
      examGoal: finalGoal,
      dailyAvailableHours: Number(dailyHours),
      preferredStudyTime: preferredTime === "Flexible" ? "Morning + Evening" : preferredTime,
    });

    // Populate user's customized subjects if they added/modified them
    if (initialTopics.length > 0) {
      initialTopics.forEach((t, index) => {
        // Only add if not already in subjects
        const exists = subjects.some((s) => s.name.toLowerCase() === t.name.toLowerCase());
        if (!exists) {
          addSubject({
            name: t.name,
            difficulty: t.difficulty,
            confidence: t.confidence,
            progress: 30 + index * 10,
            priority: t.difficulty === "Hard" ? "High" : "Medium",
            targetDate: targetDate,
            examDate: targetDate,
            notes: `Added during onboarding for ${finalGoal}`,
            color: ["#6366f1", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6"][index % 5],
          });
        }
      });
    }

    showToast("Profile configured! Generating your personalized AI study plan...", "success");
    setActiveTab("planner");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="py-6 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/20">
              ✦
            </div>
            <span className="font-extrabold text-lg tracking-tight">StudyFlow AI</span>
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Step {step} of 5
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8">
          {/* Progress Indicators */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-indigo-600 dark:bg-indigo-500" : "bg-slate-100 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                  <Target className="w-3.5 h-3.5" />
                  <span>Step 1: Define Target</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  What are you working toward?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Select your primary objective or type your own custom academic or career goal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setCustomGoal("");
                    }}
                    className={`p-4 rounded-2xl border text-left font-semibold text-sm transition flex items-center justify-between ${
                      selectedGoal === goal && !customGoal
                        ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-600/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>{goal}</span>
                    {selectedGoal === goal && !customGoal && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Or specify a custom goal
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Data Structures for Software Interviews"
                  value={customGoal}
                  onChange={(e) => {
                    setCustomGoal(e.target.value);
                    if (e.target.value) setSelectedGoal("Custom");
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-indigo-600/20 transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Step 2: Add Topics</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  What do you want to learn?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Add the subjects or specific topics you need to master.
                </p>
              </div>

              {/* Topics list */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {initialTopics.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {t.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {t.difficulty}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Topic Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Chemistry, Machine Learning, English..."
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTopic();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={newTopicDifficulty}
                  onChange={(e: any) => setNewTopicDifficulty(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-indigo-600/20 transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Step 3: Timeline</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  When is your target date?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Set the final exam date or milestone target so StudyFlow can pace your sessions.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Completion / Exam Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-base font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2">
                {[14, 30, 60, 90].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setTargetDate(getFormattedDate(days))}
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition text-center"
                  >
                    In {days} Days
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-indigo-600/20 transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Step 4: Availability</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  How much time can you study each day?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Be honest with your schedule. Gemini guarantees never to exceed this limit.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Daily Study Target
                  </span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
                    {dailyHours} Hours/day
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                  <span>1 hour (Light)</span>
                  <span>3.5 hours (Balanced)</span>
                  <span>8 hours (Intensive)</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-indigo-600/20 transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                  <SunMedium className="w-3.5 h-3.5" />
                  <span>Step 5: Daily Rhythm</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  When do you study best?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Select your peak focus window so difficult topics get optimal retention slots.
                </p>
              </div>

              <div className="space-y-3">
                {studyTimeOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setPreferredTime(opt.label)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                      preferredTime === opt.label
                        ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-600/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">{opt.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                    {preferredTime === opt.label && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Build My Plan →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
