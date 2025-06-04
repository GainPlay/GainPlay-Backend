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
  color: string; // Changed from color to color
}

export interface UserHealthData {
  user: {
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

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;

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

      return parsedResponse.insights;
    } catch (error) {
      this.logger.error("Error generating health insights:", error);
      this.logger.error("Raw response text:", error.message);

      // Return fallback insights if Gemini fails
      return this.getFallbackInsights(userData);
    }
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

    return [
      {
        icon: "💪",
        color: "red", // Tailwind color name for from-red-500 to-red-600
        type: "performance",
        title: "Keep Up the Good Work!",
        description: `You've maintained ${workoutConsistency}% consistency in your recent workouts. ${workoutConsistency > 80 ? "This is excellent progress that shows real dedication!" : "Focus on staying consistent to see better results."}`,
      },
      {
        icon: "❤️",
        color: "teal",
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

Generate insights focusing on:
1. Performance trends and achievements
2. Health metrics and recommendations
3. Goal progress and motivation

Available insight types: "performance", "health", "motivation", "nutrition", "recovery", "progress"
Available icons: "💪", "🏃", "❤️", "🔥", "⭐", "🎯", "📈", "🥗", "😴", "🏆"
Available colors: "red", "blue", "green", "purple", "yellow", "pink", "indigo", "teal", "orange", "emerald"

IMPORTANT: 
- Return ONLY a valid JSON object without any markdown formatting or extra text
- Keep descriptions as 1-2 sentences (around 50-100 characters total)
- Make descriptions informative yet encouraging and actionable
- Use color names that work with Tailwind CSS (from-{color}-500 to-{color}-600)

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
      "color": "teal"
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
}
