import { Subject, StudyTask, StudentProfile, AIInsight, RescheduleRecommendation } from "../types";

export interface GeneratePlanRequest {
  subjects: Subject[];
  dailyHours: number;
  preferredTime: string;
  studyDays: string[];
  breakDuration: number;
  targetDays?: number;
  examGoal?: string;
}

export interface GeneratePlanResponse {
  success: boolean;
  source: "gemini" | "fallback" | "fallback-on-error";
  data: {
    overview: string;
    weeklyTotalHours: number;
    schedule: Array<{
      id: string;
      day: string;
      dateOffset: number;
      startTime: string;
      endTime: string;
      duration: number;
      subjectName: string;
      subjectCode?: string;
      topic: string;
      type: "Learning" | "Practice" | "Revision" | "Mock Test" | "Weak Area Review";
      priority: "Low" | "Medium" | "High" | "Critical";
      reason: string;
    }>;
  };
}

export async function generateAIStudyPlan(payload: GeneratePlanRequest): Promise<GeneratePlanResponse> {
  const res = await fetch("/api/planner/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Server returned ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export async function rescheduleMissedTaskWithAI(
  missedTask: StudyTask,
  upcomingSchedule: StudyTask[],
  studentPreferences: Partial<StudentProfile>
): Promise<{ success: boolean; source: string; data: RescheduleRecommendation }> {
  const res = await fetch("/api/planner/reschedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      missedTask,
      upcomingSchedule,
      studentPreferences,
    }),
  });
  if (!res.ok) {
    throw new Error(`Rescheduling request failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchAIInsights(
  subjects: Subject[],
  tasks: StudyTask[],
  profile: StudentProfile
): Promise<{ success: boolean; source: string; insights: AIInsight[] }> {
  const res = await fetch("/api/planner/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subjects,
      tasks,
      profile,
    }),
  });
  if (!res.ok) {
    throw new Error(`Insights request failed: ${res.statusText}`);
  }
  return res.json();
}

export async function checkServerHealth(): Promise<{ status: string; geminiConfigured: boolean }> {
  try {
    const res = await fetch("/api/health");
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch {
    return { status: "offline", geminiConfigured: false };
  }
}
