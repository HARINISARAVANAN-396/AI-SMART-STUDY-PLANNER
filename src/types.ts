export type DifficultyLevel = "Easy" | "Medium" | "Hard";

export type ConfidenceLevel = "Low" | "Medium" | "High";

export type PriorityLevel = "Low" | "Medium" | "High" | "Critical";

export type StudyType =
  | "Learning"
  | "Practice"
  | "Revision"
  | "Mock Test"
  | "Weak Area Review";

export type TaskStatus = "pending" | "completed" | "missed";

export interface Subject {
  id: string;
  name: string;
  code?: string;
  difficulty: DifficultyLevel;
  confidence?: ConfidenceLevel;
  progress: number; // 0 to 100
  examDate?: string; // YYYY-MM-DD
  targetDate?: string; // YYYY-MM-DD
  priority: PriorityLevel;
  notes?: string;
  color?: string;
  createdAt: string;
}

export interface StudyTask {
  id: string;
  subjectId?: string;
  subjectName: string;
  subjectCode?: string;
  topic: string;
  day?: string; // e.g. "Monday"
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "07:30 AM"
  endTime?: string; // e.g. "08:30 AM"
  duration: number; // in minutes
  type: StudyType;
  priority: PriorityLevel;
  status: TaskStatus;
  reason?: string;
  completedAt?: string;
  rescheduledFrom?: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  degree?: string;
  college?: string;
  semester?: string;
  learningGoal: string; // e.g. "Prepare for competitive exams and ace STEM finals"
  dailyAvailableHours: number;
  preferredStudyTime: string; // e.g. "Morning + Evening", "Flexible", "Morning", "Afternoon", "Evening", "Night Owl"
  weeklyStudyDays: string[]; // ["Monday", "Tuesday", ...]
  breakDurationMinutes: number;
  examGoal?: string;
  darkMode: boolean;
  aiRecommendationsEnabled: boolean;
  studyRemindersEnabled: boolean;
  streakDays: number;
  totalStudyMinutes: number;
}

export interface AIInsight {
  id: string;
  category: "Attention" | "Recommendation" | "Progress" | "Goal";
  title: string;
  description: string;
  actionText?: string;
  icon?: string;
}

export interface RescheduleRecommendation {
  originalTask: StudyTask;
  rescheduledSlot: {
    day: string;
    time: string;
    duration: number;
    subjectName: string;
    topic: string;
  };
  compensationAdjustment: string;
  explanation: string;
}

export interface StudyPlan {
  id: string;
  goal: string;
  generatedAt: string;
  weeklyTotalHours: number;
  overview: string;
  schedule: StudyTask[];
}

export type ActiveTab =
  | "landing"
  | "login"
  | "signup"
  | "onboarding"
  | "dashboard"
  | "subjects"
  | "planner"
  | "schedule"
  | "tasks"
  | "progress"
  | "insights"
  | "focus"
  | "settings";
