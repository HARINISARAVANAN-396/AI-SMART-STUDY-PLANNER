import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Subject,
  StudyTask,
  StudentProfile,
  AIInsight,
  ActiveTab,
  TaskStatus,
} from "../types";
import {
  defaultProfile,
  defaultSubjects,
  defaultTasks,
  defaultInsights,
} from "../data/mockData";
import { fetchAIInsights, checkServerHealth } from "../services/api";
import {
  auth,
  isConfigured as isFirebaseConfigured,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  syncUserDataToFirestore,
  fetchUserDataFromFirestore,
} from "../services/firebase";

interface Toast {
  id: string;
  type: "success" | "info" | "warning" | "error";
  message: string;
}

interface StudyContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: { id: string; name: string; email: string } | null;
  isAuthenticated: boolean;
  profile: StudentProfile;
  subjects: Subject[];
  tasks: StudyTask[];
  insights: AIInsight[];
  toasts: Toast[];
  serverStatus: { status: string; geminiConfigured: boolean };
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeFocusTask: StudyTask | null;
  setActiveFocusTask: (task: StudyTask | null) => void;
  startFocusMode: (task?: StudyTask) => void;
  // Profile methods
  updateProfile: (updated: Partial<StudentProfile>) => void;
  // Subject methods
  addSubject: (subject: Omit<Subject, "id" | "createdAt">) => void;
  updateSubject: (id: string, updated: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  // Task methods
  addTask: (task: Omit<StudyTask, "id" | "createdAt">) => void;
  updateTask: (id: string, updated: Partial<StudyTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  markTaskMissed: (id: string) => void;
  applyNewSchedule: (newTasks: StudyTask[]) => void;
  refreshInsights: () => Promise<void>;
  // Auth methods
  login: (email: string, pass: string, name?: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  // Utility
  showToast: (message: string, type?: "success" | "info" | "warning" | "error") => void;
  removeToast: (id: string) => void;
  resetToDemoData: () => void;
  clearAllData: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: "studyflow_profile_v2",
  SUBJECTS: "studyflow_subjects_v2",
  TASKS: "studyflow_tasks_v2",
  INSIGHTS: "studyflow_insights_v2",
  USER: "studyflow_user_v2",
  DARK_MODE: "studyflow_dark_mode_v2",
};

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("landing");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeFocusTask, setActiveFocusTask] = useState<StudyTask | null>(null);
  const [serverStatus, setServerStatus] = useState<{ status: string; geminiConfigured: boolean }>({
    status: "checking",
    geminiConfigured: false,
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Apply dark mode class to root document element
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Load state from localStorage or mock defaults
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : { id: "user-1", name: defaultProfile.name, email: defaultProfile.email };
    } catch {
      return { id: "user-1", name: defaultProfile.name, email: defaultProfile.email };
    }
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : defaultSubjects;
    } catch {
      return defaultSubjects;
    }
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : defaultTasks;
    } catch {
      return defaultTasks;
    }
  });

  const [insights, setInsights] = useState<AIInsight[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSIGHTS);
      return saved ? JSON.parse(saved) : defaultInsights;
    } catch {
      return defaultInsights;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(insights));
  }, [insights]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      // Try background Firestore sync if configured
      if (isFirebaseConfigured) {
        syncUserDataToFirestore(user.id, { profile, subjects, tasks });
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user, profile, subjects, tasks]);

  // Check health on mount
  useEffect(() => {
    checkServerHealth().then((res) => {
      setServerStatus(res);
    });
  }, []);

  const showToast = (message: string, type: "success" | "info" | "warning" | "error" = "info") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateProfileHandler = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      if (updated.name && user) {
        setUser({ ...user, name: updated.name });
      }
      return next;
    });
    showToast("Profile and study settings saved successfully", "success");
  };

  // Subjects
  const addSubject = (subj: Omit<Subject, "id" | "createdAt">) => {
    const id = `subj-${Date.now().toString(36)}`;
    const newSubject: Subject = {
      ...subj,
      id,
      createdAt: new Date().toISOString(),
    };
    setSubjects((prev) => [newSubject, ...prev]);
    showToast(`Added topic "${subj.name}" to learning goals`, "success");
  };

  const updateSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    showToast("Subject details updated", "success");
  };

  const deleteSubject = (id: string) => {
    const target = subjects.find((s) => s.id === id);
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    // Also remove associated tasks
    setTasks((prev) => prev.filter((t) => t.subjectId !== id && t.subjectName !== target?.name));
    showToast(`Removed "${target?.name || "Topic"}"`, "info");
  };

  // Tasks
  const addTask = (t: Omit<StudyTask, "id" | "createdAt">) => {
    const id = `task-${Date.now().toString(36)}`;
    const newTask: StudyTask = {
      ...t,
      id,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Scheduled task "${t.topic}"`, "success");
  };

  const updateTask = (id: string, updated: Partial<StudyTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
    showToast("Task updated", "info");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast("Task removed from schedule", "info");
  };

  const toggleTaskComplete = (id: string) => {
    let completedDuration = 0;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newStatus: TaskStatus = t.status === "completed" ? "pending" : "completed";
        const wasCompleted = newStatus === "completed";
        completedDuration = t.duration || 45;

        // Increment subject progress if completed
        if (wasCompleted && t.subjectName) {
          setSubjects((subjs) =>
            subjs.map((s) => {
              if (s.name.toLowerCase() === t.subjectName.toLowerCase() || s.id === t.subjectId) {
                const nextProgress = Math.min(100, (s.progress || 0) + 4);
                return { ...s, progress: nextProgress };
              }
              return s;
            })
          );
        }

        return {
          ...t,
          status: newStatus,
          completedAt: wasCompleted ? new Date().toISOString() : undefined,
        };
      })
    );

    const task = tasks.find((t) => t.id === id);
    if (task?.status === "completed") {
      showToast(`Marked "${task.topic}" as pending`, "info");
    } else {
      setProfile((p) => ({
        ...p,
        totalStudyMinutes: (p.totalStudyMinutes || 0) + completedDuration,
      }));
      showToast(`Session completed! Great work on "${task?.topic || "task"}" (+4% mastery)`, "success");
    }
  };

  const markTaskMissed = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "missed" } : t))
    );
    const task = tasks.find((t) => t.id === id);
    showToast(`Marked "${task?.topic}" as missed. Use "Let AI Fix My Schedule" to reschedule!`, "warning");
  };

  const applyNewSchedule = (newTasks: StudyTask[]) => {
    // Retain completed tasks, replace future pending/missed tasks with new AI generated schedule
    const completedTasks = tasks.filter((t) => t.status === "completed");
    setTasks([...completedTasks, ...newTasks]);
    showToast(`Applied ${newTasks.length} AI-optimized study sessions to your calendar!`, "success");
  };

  const refreshInsights = async () => {
    try {
      const res = await fetchAIInsights(subjects, tasks, profile);
      if (res.insights && res.insights.length > 0) {
        setInsights(res.insights);
        showToast("AI Learning Intelligence refreshed!", "success");
      }
    } catch (e) {
      console.warn("Could not refresh insights from server:", e);
      showToast("Using current academic insights", "info");
    }
  };

  const startFocusMode = (task?: StudyTask) => {
    if (task) {
      setActiveFocusTask(task);
    } else {
      const firstPending = tasks.find((t) => t.status === "pending") || null;
      setActiveFocusTask(firstPending);
    }
    setActiveTab("focus");
  };

  // Auth with Firebase & local fallback
  const login = async (email: string, pass: string, name?: string): Promise<boolean> => {
    try {
      if (auth && isFirebaseConfigured) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, pass);
          const fbUser = userCredential.user;
          const u = {
            id: fbUser.uid,
            name: fbUser.displayName || name || email.split("@")[0],
            email: fbUser.email || email,
          };
          setUser(u);
          setProfile((prev) => ({ ...prev, name: u.name, email: u.email }));
          // Fetch any cloud data
          const cloudData = await fetchUserDataFromFirestore(fbUser.uid);
          if (cloudData) {
            if (cloudData.profile) setProfile(cloudData.profile);
            if (cloudData.subjects) setSubjects(cloudData.subjects);
            if (cloudData.tasks) setTasks(cloudData.tasks);
          }
          setActiveTab("dashboard");
          showToast(`Welcome back, ${u.name}!`, "success");
          return true;
        } catch (fbErr: any) {
          console.warn("Firebase Auth signin failed, trying local mode:", fbErr.message);
        }
      }

      // Local fallback auth
      const studentName = name || email.split("@")[0].replace(/[._]/g, " ") || "Student";
      const formattedName = studentName.charAt(0).toUpperCase() + studentName.slice(1);
      const loggedUser = {
        id: `usr-${Date.now().toString(36)}`,
        name: formattedName,
        email,
      };
      setUser(loggedUser);
      setProfile((prev) => ({
        ...prev,
        name: loggedUser.name,
        email: loggedUser.email,
      }));
      setActiveTab("dashboard");
      showToast(`Welcome back, ${loggedUser.name}!`, "success");
      return true;
    } catch (err: any) {
      showToast(err.message || "Failed to log in", "error");
      return false;
    }
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      if (auth && isFirebaseConfigured) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
          const fbUser = userCredential.user;
          const u = {
            id: fbUser.uid,
            name: name.trim(),
            email: fbUser.email || email,
          };
          setUser(u);
          setProfile((prev) => ({ ...prev, name: u.name, email: u.email }));
          setActiveTab("onboarding");
          showToast(`Welcome to StudyFlow AI, ${name}! Let's set up your study plan.`, "success");
          return true;
        } catch (fbErr: any) {
          console.warn("Firebase Auth signup failed, trying local mode:", fbErr.message);
        }
      }

      // Local fallback signup
      const newUser = {
        id: `usr-${Date.now().toString(36)}`,
        name: name.trim(),
        email: email.trim(),
      };
      setUser(newUser);
      setProfile((prev) => ({
        ...prev,
        name: newUser.name,
        email: newUser.email,
      }));
      setActiveTab("onboarding");
      showToast(`Welcome to StudyFlow AI, ${name}! Let's set up your study plan.`, "success");
      return true;
    } catch (err: any) {
      showToast(err.message || "Failed to create account", "error");
      return false;
    }
  };

  const logout = () => {
    if (auth && isFirebaseConfigured) {
      fbSignOut(auth).catch((e) => console.warn("Signout error:", e));
    }
    setUser(null);
    setActiveTab("landing");
    showToast("Signed out successfully", "info");
  };

  const resetToDemoData = () => {
    setProfile(defaultProfile);
    setSubjects(defaultSubjects);
    setTasks(defaultTasks);
    setInsights(defaultInsights);
    setUser({ id: "user-1", name: defaultProfile.name, email: defaultProfile.email });
    showToast("Loaded realistic StudyFlow sample subjects and tasks", "success");
  };

  const clearAllData = () => {
    setSubjects([]);
    setTasks([]);
    setInsights([]);
    showToast("Cleared study data", "info");
  };

  return (
    <StudyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        isAuthenticated: Boolean(user),
        profile,
        subjects,
        tasks,
        insights,
        toasts,
        serverStatus,
        darkMode,
        toggleDarkMode,
        activeFocusTask,
        setActiveFocusTask,
        startFocusMode,
        updateProfile: updateProfileHandler,
        addSubject,
        updateSubject,
        deleteSubject,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        markTaskMissed,
        applyNewSchedule,
        refreshInsights,
        login,
        signup,
        logout,
        showToast,
        removeToast,
        resetToDemoData,
        clearAllData,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error("useStudy must be used within a StudyProvider");
  }
  return context;
};
