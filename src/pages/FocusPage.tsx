import React, { useState, useEffect } from "react";
import { useStudy } from "../context/StudyContext";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  Flame,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";

export const FocusPage: React.FC = () => {
  const { activeFocusTask, tasks, toggleTaskComplete, setActiveTab, showToast } = useStudy();

  // Selected timer duration in minutes (25, 45, 60)
  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  const currentTask = activeFocusTask || tasks.find((t) => t.status === "pending") || {
    id: "adhoc-1",
    topic: "Algebra Practice & Deep Concept Work",
    subjectName: "Mathematics",
    duration: 25,
    status: "pending",
  };

  // When selectedDuration changes and timer not active, reset seconds
  const setTimerDuration = (mins: number) => {
    setSelectedDuration(mins);
    if (!isActive) {
      setSecondsRemaining(mins * 60);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      showToast("Focus session finished! Outstanding discipline.", "success");
      // Play a soft beep if audio is available
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch {
        // audio context ignored
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const togglePlay = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsRemaining(selectedDuration * 60);
  };

  const handleComplete = () => {
    if (currentTask.id && currentTask.id !== "adhoc-1") {
      toggleTaskComplete(currentTask.id);
    } else {
      showToast("Completed focus session!", "success");
    }
    setIsActive(false);
    setSecondsRemaining(selectedDuration * 60);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const progressPercent = ((selectedDuration * 60 - secondsRemaining) / (selectedDuration * 60)) * 100;

  return (
    <div className="min-h-full flex flex-col justify-between max-w-4xl mx-auto py-4 sm:py-8 px-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Focus Mode</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition"
            title={soundEnabled ? "Mute chimes" : "Enable chime"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Distraction-Free Mode</span>
          </span>
        </div>
      </div>

      {/* Main Focus Centerpiece */}
      <div className="flex-1 flex flex-col items-center justify-center my-8 text-center space-y-8">
        <div className="space-y-2 max-w-md">
          <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {currentTask.subjectName || "Focus Session"}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {currentTask.topic || "Algebra Practice"}
          </h1>
        </div>

        {/* Circular Timer Visual */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-100 dark:text-slate-800 stroke-current"
              strokeWidth="4"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-indigo-600 dark:text-indigo-500 stroke-current transition-all duration-500 ease-linear"
              strokeWidth="4.5"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
              {formattedTime}
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300 dark:bg-slate-600"}`} />
              {isActive ? "Deep Study in Progress" : "Paused"}
            </span>
          </div>
        </div>

        {/* Duration Picker Pills */}
        <div className="flex items-center gap-2">
          {[25, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => setTimerDuration(mins)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedDuration === mins
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>

        {/* Action Controls: Pause/Play, Reset, Complete */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className={`px-8 py-4 rounded-2xl font-bold text-sm text-white shadow-lg transition flex items-center gap-2 transform hover:-translate-y-0.5 ${
              isActive
                ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/25"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30"
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={handleComplete}
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
            title="Mark session complete"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Motivational Bottom Quote */}
      <div className="py-4 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>"Study smarter. Make every hour count." — StudyFlow AI</span>
        </p>
      </div>
    </div>
  );
};
