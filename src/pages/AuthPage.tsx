import React, { useState } from "react";
import { useStudy } from "../context/StudyContext";
import { GraduationCap, ArrowRight, Lock, Mail, User as UserIcon, Sparkles } from "lucide-react";

interface AuthPageProps {
  initialMode?: "login" | "signup";
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = "login" }) => {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login, signup, setActiveTab, showToast } = useStudy();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter both email and password");
      return;
    }

    if (!isLogin && !name) {
      setErrorMsg("Please enter your full name");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password, name);
      } else {
        await signup(name, email, password);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("alex.rivera@university.edu");
    setPassword("demoStudent123");
    setName("Alex Rivera");
    login("alex.rivera@university.edu", "demoStudent123", "Alex Rivera");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={() => setActiveTab("landing")}
          className="cursor-pointer inline-flex items-center gap-2.5 p-2 rounded-2xl bg-white border border-slate-200 shadow-2xs mb-4"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-base text-slate-900 pr-2">
            AI Smart Study Planner
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {isLogin ? "Welcome back to your studies" : "Create your student account"}
        </h2>
        <p className="text-xs text-slate-500 mt-1.5">
          {isLogin
            ? "Sign in to access your adaptive AI schedule and subject tracker."
            : "Sign up to start organizing exams, coursework, and daily hours."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-md shadow-slate-200/50 sm:rounded-3xl border border-slate-200 sm:px-10">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                College Email
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        "Password reset instructions sent to your email (Demo: you can sign in directly).",
                        "info"
                      )
                    }
                    className="text-[11px] font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition mt-2 disabled:opacity-70"
            >
              <span>{isLogin ? "Sign In to Dashboard" : "Create My Student Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-50 text-indigo-700 font-semibold text-xs transition"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Continue with Demo Student (Alex Rivera)</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg("");
              }}
              className="text-xs text-slate-600 hover:text-indigo-600 font-medium"
            >
              {isLogin
                ? "Don't have an account? Sign up here"
                : "Already have an account? Sign in here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
