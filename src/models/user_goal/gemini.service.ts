// gemini.service.ts
import { ConfigService } from "@nestjs/config";
import { Injectable, Logger } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Interfaces for health insights
export interface Insight {
  type: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface UserHealthData {
  user: {
    id: number; // Add user ID to track responses
    name: string;
    level: number;
    experience: number;
    streak: number;
    coins: number;
  };
  settings: {
    age: number;
    weight: number; // in kg
    height: number; // in cm
    exercise_frequency: number; // times/week
    fitness_level: number; // 1 (beginner) to 5 (advanced)
    workout_duration: number; // avg. workout time in minutes
    body_structure: string;
  };
  recentWorkouts: Array<{
    started_at: string;
    completed_at: string;
    score: number;
    experience_earned: number;
    coins_earned: number;
    exercises: Array<{
      name: string;
      sets: number;
      reps: number;
      completed_reps?: number;
    }>;
  }>;
  badges: Array<{
    name: string;
    earned_at: string;
  }>;
  goals: Array<{
    name: string;
    value: number;
  }>;
}

export interface GeminiInsightResponse {
  insights: Insight[];
}

// Enhanced cache interface for storing last responses and complete history
interface CachedResponse {
  userId: number;
  insights: Insight[];
  timestamp: Date;
}

interface UserInsightHistory {
  userId: number;
  allTitles: Set<string>; // Track all titles ever sent
  lastResponse: {
    insights: Insight[];
    timestamp: Date;
  } | null;
}

const healthFocusAreas = [
  "BMI",
  "cardiovascular health",
  "hydration",
  "sleep",
  "stress",
  "posture",
  "mobility",
  "joint care",
  "injury prevention",
  "metabolic rate",
  "immune support",
];

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private responseCache: Map<number, CachedResponse> = new Map();
  private userHistories: Map<number, UserInsightHistory> = new Map();
  private readonly CACHE_EXPIRY_HOURS = 24; // Cache expires after 24 hours

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateHealthInsights(userData: UserHealthData): Promise<Insight[]> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const prompt = this.buildPrompt(userData);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean and parse the JSON response
      const cleanedText = this.extractJSON(text);
      const parsedResponse: GeminiInsightResponse = JSON.parse(cleanedText);

      // Validate the response structure
      if (!parsedResponse.insights || !Array.isArray(parsedResponse.insights)) {
        throw new Error("Invalid response structure from Gemini");
      }

      // Cache the response and update user history
      this.cacheResponse(userData.user.id, parsedResponse.insights);
      this.updateUserHistory(userData.user.id, parsedResponse.insights);

      return parsedResponse.insights;
    } catch (error) {
      this.logger.error("Error generating health insights:", error);
      this.logger.error("Raw response text:", error.message);

      // Return fallback insights if Gemini fails
      return this.getFallbackInsights(userData);
    }
  }

  private cacheResponse(userId: number, insights: Insight[]): void {
    this.responseCache.set(userId, {
      userId,
      insights,
      timestamp: new Date(),
    });
  }

  private updateUserHistory(userId: number, insights: Insight[]): void {
    let userHistory = this.userHistories.get(userId);

    if (!userHistory) {
      userHistory = {
        userId,
        lastResponse: null,
        allTitles: new Set<string>(),
      };
      this.userHistories.set(userId, userHistory);
    }

    // Add all new titles to the complete history
    insights.forEach(insight => {
      userHistory!.allTitles.add(insight.title);
    });

    // Update last response
    userHistory.lastResponse = {
      insights,
      timestamp: new Date(),
    };
  }

  private getUserHistory(userId: number): UserInsightHistory | null {
    return this.userHistories.get(userId) || null;
  }

  private getLastResponse(userId: number): CachedResponse | null {
    const cached = this.responseCache.get(userId);
    if (!cached) return null;

    // Check if cache has expired
    const hoursDiff =
      (Date.now() - cached.timestamp.getTime()) / (1000 * 60 * 60);
    if (hoursDiff > this.CACHE_EXPIRY_HOURS) {
      this.responseCache.delete(userId);
      return null;
    }

    return cached;
  }

  private extractJSON(text: string): string {
    // Remove markdown code blocks if present
    let cleanedText = text.trim();

    // Handle ```json ... ``` blocks
    const jsonBlockMatch = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      cleanedText = jsonBlockMatch[1].trim();
    }

    // Handle cases where there might be extra text before/after JSON
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    return cleanedText;
  }

  private getFallbackInsights(userData: UserHealthData): Insight[] {
    const bmi = this.calculateBMI(
      userData.settings.weight,
      userData.settings.height,
    );
    const workoutConsistency = this.calculateWorkoutConsistency(
      userData.recentWorkouts,
    );

    const fallbackInsights = [
      {
        icon: "💪",
        color: "red", // Tailwind color name for from-red-500 to-red-600
        type: "performance",
        title: "Keep Up the Good Work!",
        description: `You've maintained ${workoutConsistency}% consistency in your recent workouts. ${workoutConsistency > 80 ? "This is excellent progress that shows real dedication!" : "Focus on staying consistent to see better results."}`,
      },
      {
        icon: "❤️",
        color: "green",
        type: "health",
        title: "Health Status",
        description: `Your BMI is ${bmi.toFixed(1)} which falls in the ${this.getBMICategory(bmi)} range. Keep maintaining your current healthy lifestyle habits.`,
      },
      {
        icon: "🎯",
        color: "blue",
        type: "motivation",
        title: "Stay Motivated",
        description: `You're working towards ${userData.goals.length} goals and have built an impressive ${userData.user.streak} day streak. Your consistency is paying off!`,
      },
    ];

    // Update user history with fallback insights as well
    this.updateUserHistory(userData.user.id, fallbackInsights);

    return fallbackInsights;
  }

  private buildPrompt(userData: UserHealthData): string {
    const bmi = this.calculateBMI(
      userData.settings.weight,
      userData.settings.height,
    );
    const workoutConsistency = this.calculateWorkoutConsistency(
      userData.recentWorkouts,
    );
    const avgWorkoutScore = this.calculateAverageWorkoutScore(
      userData.recentWorkouts,
    );

    // Get user's complete insight history
    const userHistory = this.getUserHistory(userData.user.id);
    let historyText = "";

    if (userHistory) {
      // Include last response details
      const lastResponseText = userHistory.lastResponse
        ? `\n\nLAST RESPONSE TO AVOID REPEATING:\n${userHistory.lastResponse.insights
            .map(
              insight =>
                `- Type: ${insight.type}, Title: "${insight.title}", Description: "${insight.description}"`,
            )
            .join("\n")}`
        : "";

      // Include all titles ever sent
      const allTitlesText =
        userHistory.allTitles.size > 0
          ? `\n\nALL TITLES EVER SENT (NEVER REPEAT THESE):\n${Array.from(
              userHistory.allTitles,
            )
              .map(title => `- "${title}"`)
              .join("\n")}`
          : "";

      historyText = `${lastResponseText}${allTitlesText}\n\nMake sure the new insights have COMPLETELY DIFFERENT titles and focus on different aspects of the user's health and fitness journey. Be creative and avoid any repetition of previous titles or themes.`;
    }

    return `
You are a health and fitness expert AI. Based on the following user data, generate exactly 3 personalized health insights.

User Profile:
- Name: ${userData.user.name}
- Age: ${userData.settings.age}
- Weight: ${userData.settings.weight}kg
- Height: ${userData.settings.height}cm
- BMI: ${bmi.toFixed(1)}
- Current Streak: ${userData.user.streak} days
- Fitness Level: ${userData.settings.fitness_level}/5
- Exercise Frequency: ${userData.settings.exercise_frequency} times/week
- Workout Duration: ${userData.settings.workout_duration} minutes
- Body Structure: ${userData.settings.body_structure}

Recent Performance:
- Workout Consistency: ${workoutConsistency}%
- Average Workout Score: ${avgWorkoutScore}/100
- Recent Workouts: ${userData.recentWorkouts.length}

Goals: ${userData.goals.map(g => `${g.name} (${g.value})`).join(", ")}
Recent Badges: ${userData.badges.map(b => b.name).join(", ")}

Generate insights focusing on: ${healthFocusAreas.join(", ")}

Available insight types: "performance", "health", "motivation", "nutrition", "recovery", "progress", "variety", "achievement"
Available icons: "💪", "🏃", "❤️", "🔥", "⭐", "🎯", "📈", "🥗", "😴", "🏆", "🌟", "⚡", "🧘", "🎖️"
Available colors: "red", "blue", "green", "purple", "yellow", "pink", "indigo", "orange", "emerald", "cyan"

${historyText}

IMPORTANT: 
- Return ONLY a valid JSON object without any markdown formatting or extra text
- Keep descriptions as 1-2 sentences (around 50-100 characters total)
- Make descriptions informative yet encouraging and actionable
- Use color names that work with Tailwind CSS (from-{color}-500 to-{color}-600)
- ENSURE the new insights have COMPLETELY UNIQUE titles that have never been used before
- Focus on different aspects of fitness, health, or motivation than previously covered
- Be creative and innovative with titles - avoid generic or common phrases

Expected format:
{
  "insights": [
    {
      "type": "performance",
      "icon": "💪",
      "title": "Strong Performance",
      "description": "Your workout consistency has improved by 15% this month. Keep pushing to reach your full potential!",
      "color": "red"
    },
    {
      "type": "health",
      "icon": "❤️", 
      "title": "Health Zone",
      "description": "Your BMI indicates you're in a healthy range. Focus on maintaining your current nutrition habits.",
      "color": "green"
    },
    {
      "type": "motivation",
      "icon": "🎯",
      "title": "Goal Focus", 
      "description": "You're 70% closer to achieving your strength goals. Stay consistent with your training routine!",
      "color": "blue"
    }
  ]
}

Make insights specific, encouraging, and actionable with meaningful 1-2 sentence descriptions that provide value to the user.
`;
  }

  private calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  private calculateWorkoutConsistency(
    workouts: UserHealthData["recentWorkouts"],
  ): number {
    if (workouts.length === 0) return 0;

    const completedWorkouts = workouts.filter(w => w.completed_at).length;
    return Math.round((completedWorkouts / workouts.length) * 100);
  }

  private calculateAverageWorkoutScore(
    workouts: UserHealthData["recentWorkouts"],
  ): number {
    if (workouts.length === 0) return 0;

    const totalScore = workouts.reduce(
      (sum, workout) => sum + (workout.score || 0),
      0,
    );
    return Math.round(totalScore / workouts.length);
  }

  private getBMICategory(bmi: number): string {
    if (bmi < 18.5) return "underweight";
    if (bmi < 25) return "normal";
    if (bmi < 30) return "overweight";
    return "obese";
  }

  // Optional: Method to clear user history (for testing or user request)
  public clearUserHistory(userId: number): void {
    this.userHistories.delete(userId);
    this.responseCache.delete(userId);
  }

  // Optional: Method to get user's title history (for debugging/admin purposes)
  public getUserTitleHistory(userId: number): string[] {
    const userHistory = this.getUserHistory(userId);
    return userHistory ? Array.from(userHistory.allTitles) : [];
  }
}
