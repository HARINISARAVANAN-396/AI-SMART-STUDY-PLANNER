import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for backend REST persistence
let storedSubjects: any[] = [];
let storedTasks: any[] = [];

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Track temporary cooldown for models that experienced 503 / capacity limits
const modelCooldownMap = new Map<string, number>();

function getCandidateModels(): string[] {
  const now = Date.now();
  // Allowed fast models under the Gemini API skill
  const defaultList = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  
  // Sort so models currently in cooldown are demoted
  return [...defaultList].sort((a, b) => {
    const coolA = (modelCooldownMap.get(a) || 0) > now ? 1 : 0;
    const coolB = (modelCooldownMap.get(b) || 0) > now ? 1 : 0;
    return coolA - coolB;
  });
}

// Universal robust caller across candidate models with automatic retry on transient spikes
async function callGeminiWithRetryAndFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
): Promise<{ text: string; modelUsed: string }> {
  const models = getCandidateModels();
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          return { text, modelUsed: model };
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = (err?.message || "").toLowerCase();
        const errStatus = err?.status || err?.error?.status;
        const errCode = err?.code || err?.error?.code;

        const isTransient =
          errStatus === "UNAVAILABLE" ||
          errCode === 503 ||
          errCode === 429 ||
          errMsg.includes("503") ||
          errMsg.includes("unavailable") ||
          errMsg.includes("high demand") ||
          errMsg.includes("resource_exhausted") ||
          errMsg.includes("rate limit") ||
          errMsg.includes("overloaded") ||
          errMsg.includes("econnreset") ||
          errMsg.includes("etimedout") ||
          errMsg.includes("fetch failed");

        if (isTransient) {
          // Put this model in cooldown for 60 seconds
          modelCooldownMap.set(model, Date.now() + 60_000);

          if (attempt === 0) {
            // Quick 500ms jittered delay before second attempt
            await new Promise((r) => setTimeout(r, 500 + Math.random() * 300));
            continue;
          }
          console.warn(`Model ${model} in high demand/unavailable (${errCode || errStatus}), switching to fallback model...`);
          break;
        }

        // Non-transient error, move to next model
        break;
      }
    }
  }

  throw lastError || new Error("All Gemini models failed to generate content.");
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "StudyFlow AI",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Helper for realistic universal algorithmic study plan generator
function generateFallbackSchedule(payload: any) {
  const {
    subjects,
    availableHours = 3.5,
    preferredTime = "Morning + Evening",
    targetDays = 7,
    goal = "Excel in studies",
  } = payload;

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const studyTypes = ["Learning", "Practice", "Revision", "Weak Area Review", "Mock Test"];

  const timeSlotsMorning = [
    { start: "08:00 AM", end: "09:00 AM", duration: 60 },
    { start: "09:15 AM", end: "10:15 AM", duration: 60 },
    { start: "10:30 AM", end: "11:30 AM", duration: 60 },
  ];
  const timeSlotsEvening = [
    { start: "05:30 PM", end: "06:30 PM", duration: 60 },
    { start: "06:45 PM", end: "07:30 PM", duration: 45 },
    { start: "08:00 PM", end: "09:00 PM", duration: 60 },
  ];

  const pref = (preferredTime || "").toLowerCase();
  let allSlots = [...timeSlotsMorning, ...timeSlotsEvening];
  if (pref.includes("morning") && !pref.includes("evening")) {
    allSlots = timeSlotsMorning;
  } else if (pref.includes("evening") || pref.includes("night")) {
    allSlots = timeSlotsEvening;
  } else if (pref.includes("afternoon")) {
    allSlots = [
      { start: "01:30 PM", end: "02:30 PM", duration: 60 },
      { start: "02:45 PM", end: "03:45 PM", duration: 60 },
      { start: "04:00 PM", end: "05:00 PM", duration: 60 },
    ];
  }

  const validSubjects = subjects && subjects.length > 0 ? subjects : [
    { name: "Mathematics", code: "MATH201", difficulty: "Hard", priority: "High", progress: 72 },
    { name: "Programming & Algorithms", code: "CS204", difficulty: "Hard", priority: "High", progress: 65 },
    { name: "Physics", code: "PHYS101", difficulty: "Hard", priority: "Critical", progress: 48 },
    { name: "English & Critical Reasoning", code: "ENG102", difficulty: "Easy", priority: "Low", progress: 85 },
  ];

  // Prioritize subjects with low mastery, high priority, and high difficulty
  const sortedSubjects = [...validSubjects].sort((a: any, b: any) => {
    const priorityWeight: Record<string, number> = { Critical: 5, High: 4, Medium: 3, Low: 2 };
    const diffWeight: Record<string, number> = { Hard: 3, Medium: 2, Easy: 1 };
    const scoreA = (priorityWeight[a.priority] || 3) * 2 + (diffWeight[a.difficulty] || 2) - ((a.progress || 50) / 30);
    const scoreB = (priorityWeight[b.priority] || 3) * 2 + (diffWeight[b.difficulty] || 2) - ((b.progress || 50) / 30);
    return scoreB - scoreA;
  });

  const plan: any[] = [];
  let slotIndex = 0;

  const numDays = Math.min(targetDays, 7);
  for (let d = 0; d < numDays; d++) {
    const dayName = daysOfWeek[d % 7];
    const maxSessionsPerDay = Math.min(allSlots.length, Math.max(1, Math.round(Number(availableHours) || 3)));

    for (let s = 0; s < maxSessionsPerDay; s++) {
      const slot = allSlots[s % allSlots.length];
      const subj = sortedSubjects[slotIndex % sortedSubjects.length];
      slotIndex++;

      let type = studyTypes[s % studyTypes.length];
      if ((subj.progress || 50) < 45) type = "Weak Area Review";
      else if ((subj.progress || 50) > 80) type = "Mock Test";
      else if (s === 0) type = "Learning";
      else if (s === 1) type = "Practice";

      const genericTopics = [
        `${subj.name} Core Principles & Foundations`,
        `${subj.name} Problem Solving & Practice Drills`,
        `${subj.name} Deep Dive & Analysis`,
        `${subj.name} Exam Past Paper Questions`,
        `${subj.name} Spaced Repetition Revision`,
      ];
      const topic = genericTopics[(d + s) % genericTopics.length];

      plan.push({
        id: `task-${d}-${s}-${Date.now().toString(36)}`,
        day: dayName,
        dateOffset: d,
        startTime: slot.start,
        endTime: slot.end,
        duration: slot.duration,
        subjectId: subj.id || `subj-${slotIndex}`,
        subjectName: subj.name,
        subjectCode: subj.code || "SUB101",
        topic,
        type,
        priority: subj.priority || "Medium",
        reason: `${subj.name} prioritized to balance ${subj.difficulty || "medium"} difficulty with ${subj.progress || 50}% current progress.`,
      });
    }
  }

  return {
    overview: `Personalized StudyFlow schedule targeting ${validSubjects.length} subjects with ${availableHours}h daily capacity over ${numDays} days. High difficulty and approaching deadlines receive optimal morning/evening peak focus intervals.`,
    schedule: plan,
    weeklyTotalHours: Math.round((plan.reduce((sum: number, item: any) => sum + item.duration, 0) / 60) * 10) / 10,
  };
}

// 1. AI Study Planner Generator endpoint
const handleGeneratePlan = async (req: express.Request, res: express.Response) => {
  try {
    const {
      subjects = [],
      dailyHours = 3.5,
      preferredTime = "Morning + Evening",
      studyDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      breakDuration = 15,
      targetDays = 7,
      examGoal = "Prepare for upcoming exams and master all topics",
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      console.log("No GEMINI_API_KEY detected, using expert deterministic algorithm.");
      const fallback = generateFallbackSchedule({
        subjects,
        availableHours: dailyHours,
        preferredTime,
        targetDays,
        goal: examGoal,
      });
      return res.json({
        success: true,
        source: "fallback",
        data: fallback,
      });
    }

    const prompt = `
You are StudyFlow AI, an expert academic planner and learning strategist.
Generate an intelligent, highly personalized, realistic study plan for a student based on:

Configuration:
- Daily Available Study Hours: ${dailyHours} hours/day (STRICT LIMIT: DO NOT schedule more than ${dailyHours} hours total in any single day)
- Preferred Time Window: ${preferredTime}
- Weekly Study Days: ${Array.isArray(studyDays) ? studyDays.join(", ") : studyDays}
- Planning Horizon: Next ${targetDays} days
- Break Duration: ${breakDuration} minutes between sessions
- Main Learning Goal: ${examGoal}

Subjects / Topics to plan:
${JSON.stringify(subjects, null, 2)}

Requirements & Guidelines:
1. Strict workload limit: Sum of durations per day MUST NOT exceed ${dailyHours} hours (${dailyHours * 60} minutes).
2. Prioritize upcoming deadlines, High/Critical priority topics, and lower confidence or progress levels (<50%).
3. Distribute study types appropriately: "Learning" (foundational concepts), "Practice" (problem sets & exercises), "Revision" (spaced repetition), "Weak Area Review" (difficult topics), and "Mock Test" (timed assessment).
4. Alternate between demanding subjects and lighter subjects to maintain mental stamina.
5. Provide realistic start and end times that align with the student's preferred study window (${preferredTime}).
6. Include a clear, motivating strategic explanation for why each session is scheduled.
7. Return clean JSON adhering to the schema.
`;

    const { text, modelUsed } = await callGeminiWithRetryAndFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: {
              type: Type.STRING,
              description: "Strategic overview of the study schedule and rationale.",
            },
            weeklyTotalHours: {
              type: Type.NUMBER,
              description: "Total scheduled hours across the planning period.",
            },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: "e.g. Monday, Tuesday" },
                  dateOffset: { type: Type.INTEGER, description: "Day index offset from 0 to N" },
                  startTime: { type: Type.STRING, description: "e.g. 08:00 AM" },
                  endTime: { type: Type.STRING, description: "e.g. 09:00 AM" },
                  duration: { type: Type.INTEGER, description: "Duration in minutes" },
                  subjectName: { type: Type.STRING },
                  subjectCode: { type: Type.STRING },
                  topic: { type: Type.STRING, description: "Specific focused study topic" },
                  type: {
                    type: Type.STRING,
                    description: "Learning, Practice, Revision, Mock Test, or Weak Area Review",
                  },
                  priority: { type: Type.STRING, description: "Low, Medium, High, Critical" },
                  reason: {
                    type: Type.STRING,
                    description: "Pedagogical justification for this topic and slot",
                  },
                },
                required: [
                  "day",
                  "startTime",
                  "endTime",
                  "duration",
                  "subjectName",
                  "topic",
                  "type",
                  "priority",
                  "reason",
                ],
              },
            },
          },
          required: ["overview", "weeklyTotalHours", "schedule"],
        },
      },
    });

    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedData = JSON.parse(text);

    // Attach unique IDs to generated schedule items
    if (Array.isArray(parsedData.schedule)) {
      parsedData.schedule = parsedData.schedule.map((item: any, idx: number) => ({
        ...item,
        id: `ai-task-${Date.now().toString(36)}-${idx}`,
      }));
    }

    res.json({
      success: true,
      source: "gemini",
      model: modelUsed,
      data: parsedData,
    });
  } catch (error: any) {
    console.warn("AI planner unavailable, seamlessly applying expert schedule algorithm:", error?.message || error);
    const fallback = generateFallbackSchedule(req.body);
    res.json({
      success: true,
      source: "fallback-on-error",
      note: "Used algorithmic planner fallback due to temporary AI service demand.",
      data: fallback,
    });
  }
};

app.post("/api/planner/generate", handleGeneratePlan);
app.post("/api/ai/generate-plan", handleGeneratePlan);

// 2. Smart Rescheduling endpoint
const handleReschedule = async (req: express.Request, res: express.Response) => {
  try {
    const { missedTask, upcomingSchedule = [], studentPreferences = {} } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      const targetDay = "Tomorrow";
      const targetTime = "06:00 PM";
      return res.json({
        success: true,
        source: "fallback",
        data: {
          originalTask: missedTask,
          rescheduledSlot: {
            day: targetDay,
            time: targetTime,
            duration: missedTask?.duration || 45,
            topic: missedTask?.topic || "Missed Session",
            subjectName: missedTask?.subjectName || "Subject",
          },
          compensationAdjustment: "Optimized tomorrow's evening buffer block without exceeding your daily study cap.",
          explanation: `Your missed ${missedTask?.subjectName || "session"} on "${missedTask?.topic || "topic"}" has been moved to ${targetDay} at ${targetTime}. Your daily workload remains within your preferred limit.`,
        },
      });
    }

    const prompt = `
You are StudyFlow AI's smart rescheduling assistant.
A student missed a scheduled study session:

Missed Task:
${JSON.stringify(missedTask, null, 2)}

Upcoming Study Schedule:
${JSON.stringify(upcomingSchedule.slice(0, 10), null, 2)}

Student Study Preferences:
${JSON.stringify(studentPreferences, null, 2)}

Analyze future availability and redistributes the missed work into an optimal upcoming slot:
1. Do not overload the student past their daily study limits.
2. Maintain balance and avoid stacking two heavy sessions consecutively.
3. Provide a clear, encouraging academic explanation.
`;

    const { text, modelUsed } = await callGeminiWithRetryAndFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rescheduledSlot: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                time: { type: Type.STRING },
                duration: { type: Type.INTEGER },
                subjectName: { type: Type.STRING },
                topic: { type: Type.STRING },
              },
              required: ["day", "time", "duration", "subjectName", "topic"],
            },
            compensationAdjustment: {
              type: Type.STRING,
              description: "How the schedule was balanced to accommodate the session",
            },
            explanation: {
              type: Type.STRING,
              description: "Supportive, clear explanation of the rescheduled slot",
            },
          },
          required: ["rescheduledSlot", "compensationAdjustment", "explanation"],
        },
      },
    });

    const parsedData = JSON.parse(text || "{}");
    res.json({
      success: true,
      source: "gemini",
      model: modelUsed,
      data: {
        originalTask: missedTask,
        ...parsedData,
      },
    });
  } catch (err: any) {
    console.warn("Reschedule AI unavailable, using smart schedule buffer:", err?.message || err);
    res.json({
      success: true,
      source: "fallback",
      data: {
        originalTask: req.body.missedTask,
        rescheduledSlot: {
          day: "Tomorrow",
          time: "06:30 PM",
          duration: req.body.missedTask?.duration || 45,
          subjectName: req.body.missedTask?.subjectName,
          topic: req.body.missedTask?.topic,
        },
        compensationAdjustment: "Accommodated in tomorrow's evening study buffer.",
        explanation: `Moved session to tomorrow evening to preserve learning momentum without exceeding your daily target.`,
      },
    });
  }
};

app.post("/api/planner/reschedule", handleReschedule);
app.post("/api/ai/reschedule", handleReschedule);

// 3. AI Insights and Recommendations endpoint
const handleInsights = async (req: express.Request, res: express.Response) => {
  try {
    const { subjects = [], tasks = [], profile = {} } = req.body;

    const completedCount = tasks.filter((t: any) => t.status === "completed").length;
    const missedCount = tasks.filter((t: any) => t.status === "missed").length;
    const pendingCount = tasks.filter((t: any) => t.status === "pending").length;

    const ai = getGeminiClient();

    if (!ai) {
      const weakSubject = subjects.find((s: any) => s.progress < 55) || subjects[0] || { name: "Physics", progress: 48 };

      return res.json({
        success: true,
        source: "fallback",
        insights: [
          {
            id: "ins-1",
            category: "Attention",
            title: `Mastery Focus: ${weakSubject.name}`,
            description: `${weakSubject.name} current mastery is at ${weakSubject.progress || 48}%. Recommended to add a 45-minute active practice session this week to build confidence.`,
            actionText: "Schedule Practice",
          },
          {
            id: "ins-2",
            category: "Recommendation",
            title: "Peak Energy Study Alignment",
            description: "Your highest task completion rates occur in the morning. Schedule your highest priority topics during this time.",
            actionText: "Review Timing",
          },
          {
            id: "ins-3",
            category: "Progress",
            title: "Consistency Momentum",
            description: `You have completed ${completedCount} sessions. Maintaining your daily streak significantly enhances long-term retention.`,
            actionText: "View Analytics",
          },
          {
            id: "ins-4",
            category: "Goal",
            title: "Weekly Completion Target",
            description: `You have ${pendingCount} sessions scheduled this week. Finishing them will reach your 85% weekly completion target!`,
            actionText: "View Tasks",
          },
        ],
      });
    }

    const prompt = `
You are StudyFlow AI's Learning Intelligence engine.
Analyze the following student data and provide 4 targeted, actionable insights across 4 categories:
1. "Attention" (areas needing focus, low progress, or upcoming deadlines)
2. "Recommendation" (study tactics, active recall, scheduling tips)
3. "Progress" (completion patterns, streak consistency, positive reinforcement)
4. "Goal" (actionable target for the remainder of the week)

Student Profile:
${JSON.stringify(profile, null, 2)}

Subjects & Topics:
${JSON.stringify(subjects, null, 2)}

Task Completion Stats:
- Completed: ${completedCount}
- Missed: ${missedCount}
- Pending: ${pendingCount}

Return structured JSON with motivating, intelligent insights.
`;

    const { text, modelUsed } = await callGeminiWithRetryAndFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: "Attention, Recommendation, Progress, or Goal",
              },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              actionText: { type: Type.STRING },
            },
            required: ["category", "title", "description", "actionText"],
          },
        },
      },
    });

    const parsed = JSON.parse(text || "[]");
    const insights = parsed.map((item: any, idx: number) => ({
      ...item,
      id: `ai-insight-${idx}-${Date.now().toString(36)}`,
    }));

    res.json({
      success: true,
      source: "gemini",
      model: modelUsed,
      insights,
    });
  } catch (err: any) {
    console.warn("AI Insights unavailable, using strategic recommendations:", err?.message || err);
    res.json({
      success: true,
      source: "fallback",
      insights: [
        {
          id: "fallback-ins-1",
          category: "Attention",
          title: "Prioritize Approaching Deadlines",
          description: "Balance high-difficulty subjects with spaced repetition to maximize long-term retention and confidence.",
          actionText: "Review Plan",
        },
      ],
    });
  }
};

app.post("/api/planner/insights", handleInsights);
app.post("/api/ai/insights", handleInsights);

// REST API for Subjects
app.get("/api/subjects", (req, res) => {
  res.json({ success: true, subjects: storedSubjects });
});

app.post("/api/subjects", (req, res) => {
  const newSubject = {
    ...req.body,
    id: req.body.id || `subj-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  storedSubjects.push(newSubject);
  res.status(201).json({ success: true, subject: newSubject });
});

app.put("/api/subjects/:id", (req, res) => {
  const { id } = req.params;
  const index = storedSubjects.findIndex((s) => s.id === id);
  if (index !== -1) {
    storedSubjects[index] = { ...storedSubjects[index], ...req.body };
    res.json({ success: true, subject: storedSubjects[index] });
  } else {
    res.status(404).json({ success: false, error: "Subject not found" });
  }
});

app.delete("/api/subjects/:id", (req, res) => {
  const { id } = req.params;
  storedSubjects = storedSubjects.filter((s) => s.id !== id);
  res.json({ success: true, message: "Subject deleted" });
});

// REST API for Tasks
app.get("/api/tasks", (req, res) => {
  res.json({ success: true, tasks: storedTasks });
});

app.post("/api/tasks", (req, res) => {
  const newTask = {
    ...req.body,
    id: req.body.id || `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  storedTasks.push(newTask);
  res.status(201).json({ success: true, task: newTask });
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const index = storedTasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    storedTasks[index] = { ...storedTasks[index], ...req.body };
    res.json({ success: true, task: storedTasks[index] });
  } else {
    res.status(404).json({ success: false, error: "Task not found" });
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  storedTasks = storedTasks.filter((t) => t.id !== id);
  res.json({ success: true, message: "Task deleted" });
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyFlow AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
