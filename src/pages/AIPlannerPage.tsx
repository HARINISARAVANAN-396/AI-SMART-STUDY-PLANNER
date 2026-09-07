import React, { useState, useEffect } from "react";
import { useStudy } from "../context/StudyContext";
import { generateAIStudyPlan } from "../services/api";
import { StudyTask, StudyType } from "../types";
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Sliders,
  RotateCcw,
  Zap,
  Plus,
  Compass,
  Check,
  Flame,
} from "lucide-react";
import { getFormattedDate } from "../data/mockData";

export const AIPlannerPage: React.FC = () => {
  const {
    subjects,
    profile,
    updateProfile,
    applyNewSchedule,
    setActiveTab,
    showToast,
    addSubject,
  } = useStudy();

  // Planning Form parameters as requested
  const [studyGoal, setStudyGoal] = useState<string>(
    profile.learningGoal || profile.examGoal || "Ace Final Exams and Coursework"
  );
  const [targetDate, setTargetDate] = useState<string>(getFormattedDate(14));
  const [dailyHours, setDailyHours] = useState<number>(profile.dailyAvailableHours || 3.5);
  const [preferredTime, setPreferredTime] = useState<string>("Morning");
  const [focusStrategy, setFocusStrategy] = useState<
    "Balanced" | "Exam Cram" | "Weak Areas First" | "Spaced Repetition"
  >("Balanced");

  // Selected subjects (multi-select)
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(
    subjects.map((s) => s.id)
  );

  // Quick add custom topic inside planner
  const [customTopicName, setCustomTopicName] = useState<string>("");
  const [showCustomTopicInput, setShowCustomTopicInput] = useState<boolean>(false);

  // Dynamic loading state messages as requested
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const loadingMessages = [
    "Analyzing your syllabus and learning curve...",
    "Optimizing study intervals...",
    "Building your personalized plan...",
  ];

  useEffect(() => {
    let timer: any;
    if (isGenerating) {
      setLoadingStep(0);
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  // Result state
  const [generatedPlan, setGeneratedPlan] = useState<{
    overview: string;
    weeklyTotalHours: number;
    schedule: any[];
    planDays?: number;
    sessionCount?: number;
  } | null>(null);

  const toggleSubject = (id: string) => {
    if (selectedSubjectIds.includes(id)) {
      if (selectedSubjectIds.length > 1) {
        setSelectedSubjectIds(selectedSubjectIds.filter((sid) => sid !== id));
      } else {
        showToast("Keep at least one subject selected", "warning");
      }
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, id]);
    }
  };

  const handleAddCustomTopic = () => {
    if (!customTopicName.trim()) return;
    const name = customTopicName.trim();
    addSubject({
      name,
      difficulty: "Medium",
      confidence: "Medium",
      progress: 25,
      priority: "High",
      targetDate: targetDate,
      examDate: targetDate,
      color: "#6366f1",
    });
    setCustomTopicName("");
    setShowCustomTopicInput(false);
    showToast(`Added topic "${name}" to your planner`, "success");
  };

  const handleGenerate = async () => {
    if (subjects.length === 0) {
      showToast("Please add at least one topic first", "warning");
      setActiveTab("subjects");
      return;
    }

    const filteredSubjects = subjects.filter((s) => selectedSubjectIds.includes(s.id));
    if (filteredSubjects.length === 0) {
      showToast("Please select at least one subject to plan", "warning");
      return;
    }

    setIsGenerating(true);
    setGeneratedPlan(null);

    // Save profile preferences
    updateProfile({
      dailyAvailableHours: Number(dailyHours),
      preferredStudyTime: preferredTime,
      examGoal: studyGoal,
      learningGoal: studyGoal,
    });

    try {
      const response = await generateAIStudyPlan({
        subjects: filteredSubjects,
        dailyHours: Number(dailyHours),
        preferredTime,
        studyDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        breakDuration: 15,
        targetDays: 7,
        examGoal: `${studyGoal} (Strategy: ${focusStrategy})`,
      });

      if (response.data) {
        const schedule = response.data.schedule || [];
        const totalDuration = schedule.reduce((sum: number, s: any) => sum + (s.duration || 45), 0);
        const totalHours = Math.round((totalDuration / 60) * 10) / 10;

        setGeneratedPlan({
          ...response.data,
          weeklyTotalHours: totalHours || response.data.weeklyTotalHours || 18,
          planDays: 7,
          sessionCount: schedule.length || 14,
        });
        showToast("Personalized AI study plan generated!", "success");
      }
    } catch (err: any) {
      console.error("AI Generation error:", err);
      showToast("Generated fallback schedule tailored to your goals", "info");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToActiveSchedule = () => {
    if (!generatedPlan || !generatedPlan.schedule) return;

    // Convert generated items into StudyTask format
    const newTasks: StudyTask[] = generatedPlan.schedule.map((item: any, idx: number) => {
      const d = new Date();
      d.setDate(d.getDate() + (item.dateOffset !== undefined ? item.dateOffset : Math.floor(idx / 2)));
      const dateStr = d.toISOString().split("T")[0];

      return {
        id: item.id || `task-ai-${Date.now().toString(36)}-${idx}`,
        subjectId: item.subjectId,
        subjectName: item.subjectName,
        subjectCode: item.subjectCode,
        topic: item.topic,
        day: item.day,
        date: dateStr,
        startTime: item.startTime,
        endTime: item.endTime,
        duration: item.duration || 45,
        type: (item.type as StudyType) || "Practice",
        priority: item.priority || "High",
        status: "pending",
        reason: item.reason,
        createdAt: new Date().toISOString(),
      };
    });

    applyNewSchedule(newTasks);
    setActiveTab("schedule");
  };

  // Group generated schedule by day
  const groupedSchedule =
    generatedPlan?.schedule.reduce((acc: Record<string, any[]>, item: any) => {
      const day = item.day || "Day 1";
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {}) || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>AI Study Planning Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          AI Study Planner
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Configure your study parameters and let Gemini construct an adaptive, burnout-free timetable that maximizes your cognitive retention.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Parameter Configuration Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Planner Parameters</span>
            </h3>

            {/* 1. Study Goal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Study Goal
              </label>
              <input
                type="text"
                value={studyGoal}
                onChange={(e) => setStudyGoal(e.target.value)}
                placeholder="e.g. Ace Final Exams, Master Machine Learning"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* 2. Target Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Date / Exam Milestone
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* 3. Daily Available Hours */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Daily Available Hours
                </label>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  {dailyHours} hours/day
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* 4. Subjects to Include (multi-select + custom) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Subjects to Include
                </label>
                <button
                  type="button"
                  onClick={() => setShowCustomTopicInput(!showCustomTopicInput)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Topic</span>
                </button>
              </div>

              {showCustomTopicInput && (
                <div className="flex gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <input
                    type="text"
                    placeholder="New topic name..."
                    value={customTopicName}
                    onChange={(e) => setCustomTopicName(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTopic}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                {subjects.map((s) => {
                  const isChecked = selectedSubjectIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSubject(s.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                        isChecked
                          ? "bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-950 dark:text-indigo-100"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-bold">{s.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {s.difficulty}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Preferred Study Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Preferred Study Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Morning", "Afternoon", "Evening"].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setPreferredTime(time)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition ${
                      preferredTime === time
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Focus Strategy */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Focus Strategy
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Balanced", desc: "Even workload across all subjects" },
                  { name: "Exam Cram", desc: "Prioritize upcoming deadlines" },
                  { name: "Weak Areas First", desc: "Frontload low confidence topics" },
                  { name: "Spaced Repetition", desc: "Active recall intervals" },
                ].map((strat) => (
                  <button
                    key={strat.name}
                    type="button"
                    onClick={() => setFocusStrategy(strat.name as any)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      focusStrategy === strat.name
                        ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-950 dark:text-indigo-100 ring-1 ring-indigo-600"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xs font-bold">{strat.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {strat.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button: Generate AI Study Plan */}
            <button
              id="generate-ai-plan-btn"
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{isGenerating ? "Building Plan..." : "Generate AI Study Plan ✨"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Loading State OR Generated Plan Output */}
        <div className="lg:col-span-7 space-y-6">
          {isGenerating ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-6 min-h-[420px]">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold animate-bounce shadow-lg shadow-indigo-600/30">
                  ✦
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white transition-all duration-300">
                  {loadingMessages[loadingStep]}
                </h4>
                <p className="text-xs text-slate-400">
                  Gemini is evaluating your deadlines, confidence levels, and cognitive energy curve.
                </p>
              </div>

              <div className="w-48 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          ) : generatedPlan ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Summary Card as requested */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Generated Plan Summary
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {generatedPlan.planDays || 7}-day plan created • {generatedPlan.sessionCount || 14} study sessions • {generatedPlan.weeklyTotalHours || 18} total hours
                    </h3>
                  </div>

                  <button
                    onClick={handleApplyToActiveSchedule}
                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>Apply Plan to My Schedule →</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {generatedPlan.overview}
                </p>
              </div>

              {/* Weekly & Daily Breakdown */}
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Daily Schedule Breakdown
                </h4>

                <div className="space-y-3">
                  {Object.entries(groupedSchedule).map(([day, items]: [string, any]) => (
                    <div
                      key={day}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {day}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {items.reduce((s: number, i: any) => s + (i.duration || 45), 0)} min total
                        </span>
                      </div>

                      <div className="space-y-2">
                        {items.map((it: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                {it.startTime || "09:00 AM"}
                              </span>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {it.subjectName}
                                </span>
                                <span className="text-slate-400 mx-1.5">•</span>
                                <span className="text-slate-600 dark:text-slate-300">
                                  {it.topic}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                                {it.type || "Practice"}
                              </span>
                              <span className="font-mono text-slate-500 font-bold">
                                {it.duration || 45}m
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleApplyToActiveSchedule}
                    className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2"
                  >
                    <span>Apply Plan to My Schedule →</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px]">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl">
                ✦
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Ready to Optimize Your Study Week
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your parameters on the left and click "Generate AI Study Plan" to review your intelligent breakdown.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
