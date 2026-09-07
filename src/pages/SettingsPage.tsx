import React, { useState } from "react";
import { useStudy } from "../context/StudyContext";
import {
  User,
  GraduationCap,
  Clock,
  Calendar,
  Save,
  RotateCcw,
  LogOut,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile, resetToDemoData, logout, showToast } = useStudy();

  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [college, setCollege] = useState(profile.college || "");
  const [degree, setDegree] = useState(profile.degree || "");
  const [semester, setSemester] = useState(profile.semester || "");
  const [dailyHours, setDailyHours] = useState(profile.dailyAvailableHours || 3);
  const [preferredTime, setPreferredTime] = useState(profile.preferredStudyTime || "Morning + Evening");
  const [examGoal, setExamGoal] = useState(profile.examGoal || "");
  const [breakDuration, setBreakDuration] = useState(profile.breakDurationMinutes || 15);
  const [studyDays, setStudyDays] = useState<string[]>(profile.weeklyStudyDays || [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDay = (day: string) => {
    if (studyDays.includes(day)) {
      if (studyDays.length > 1) {
        setStudyDays(studyDays.filter((d) => d !== day));
      }
    } else {
      setStudyDays([...studyDays, day]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      college: college.trim(),
      degree: degree.trim(),
      semester: semester.trim(),
      dailyAvailableHours: Number(dailyHours),
      preferredStudyTime: preferredTime,
      examGoal: examGoal.trim(),
      breakDurationMinutes: Number(breakDuration),
      weeklyStudyDays: studyDays,
    });
    showToast("Profile & study settings saved successfully!", "success");
  };

  const handleResetDemo = () => {
    if (window.confirm("Reset all subjects and schedule to fresh sample data?")) {
      resetToDemoData();
      setName("Alex Rivera");
      setCollege("Stanford University");
      setDegree("B.S. Computer Engineering");
      setSemester("Semester 6");
      setDailyHours(3);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile & Study Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure your academic degree, target hours, and daily scheduling bounds.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Academic Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Academic Identity</h3>
              <p className="text-xs text-slate-400">Your college, major, and current standing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Student Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                College Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                University / College
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Major / Degree
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Semester
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target GPA / Exam Target
              </label>
              <input
                type="text"
                value={examGoal}
                onChange={(e) => setExamGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Study Timing Preferences */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Study Capacity Bounds</h3>
              <p className="text-xs text-slate-400">Strict limits fed into the Gemini planning engine</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Daily Available Study Time
                </label>
                <span className="text-xs font-bold text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Study Window
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Morning + Evening">Morning + Evening</option>
                  <option value="Morning (06:00 AM – 11:00 AM)">Morning (06:00 AM – 11:00 AM)</option>
                  <option value="Afternoon (12:00 PM – 05:00 PM)">Afternoon (12:00 PM – 05:00 PM)</option>
                  <option value="Evening (05:00 PM – 10:00 PM)">Evening (05:00 PM – 10:00 PM)</option>
                  <option value="Night Owl (09:00 PM – 01:00 AM)">Night Owl (09:00 PM – 01:00 AM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Break Interval Between Sessions
                </label>
                <select
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes (Standard)</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Active Weekly Study Days
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => {
                  const isSelected = studyDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            <span>Save All Preferences</span>
          </button>
        </div>
      </form>

      {/* Danger / Utility Zone */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Data Management & Sign Out</h3>
        <p className="text-xs text-slate-500">
          Reset your study calendar or switch account sessions.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetDemo}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset to Realistic College Demo Data</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
