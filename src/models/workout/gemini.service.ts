import { GoogleGenerativeAI } from "@google/generative-ai";
import { Injectable, NotFoundException } from "@nestjs/common";
import { EXCERCISES } from "./constants";
import { UserGoalsService } from "../user_goal/user-goals.service";
import { UserSettingsService } from "../user_setting/user-settings.service";

@Injectable()
export class GeminiService {
  private model;

  constructor(
    private userGoalsService: UserGoalsService,
    private userSettingsService: UserSettingsService,
  ) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateWorkout(userId: number) {
    // Fetch user's goals and settings
    const [userGoals, userSettings] = await Promise.all([
      this.userGoalsService.findByUser(userId),
      this.userSettingsService.findByUser(userId).catch(() => null),
    ]);

    if (!userGoals?.length && !userSettings) {
      throw new NotFoundException("User profile data not found");
    }

    // Create a comprehensive user profile from database data
    const userProfile = {
      goals: userGoals.map(ug => ({
        value: ug.value,
        name: ug.goals?.name,
        description: ug.goals?.description,
      })),
      settings: userSettings
        ? {
            fitness_level: userSettings.fitness_level,
            exercise_frequency: userSettings.exercise_frequency,
          }
        : null,
    };

    // Create a prompt that instructs Gemini to generate a structured workout
    const prompt = `
      You are an AI fitness coach. Your task is to create a customized workout plan based on a provided list of exercises and a user's profile data.
      
      ## **Available Exercises**
      Below is a table of available exercises:
      
      ${EXCERCISES}
      
      ## **User Profile Data**
      The user has provided the following details about their physical status and goals:
      
      ### Goals:
      ${userProfile.goals.map(goal => `- ${goal.name}: ${goal.description} (Target Value: ${goal.value})`).join("\n") || "No specific goals set"}
      
      ### User Settings:
      - Exercise Frequency: ${userProfile.settings?.exercise_frequency || "Not specified"} days per week
      - Fitness Level: ${userProfile.settings?.fitness_level || "Not specified"} (on a scale of 1-5)
      
      ## **Task**
      Create a workout list that will be used for the next workout session. Format the response as an array of exercises:
      
      [
        {
          "exerciseId": <exercise_id_from_available_exercises>,
          "exerciseName": "<exercise_name>",
          "targetSets": <number_of_sets>,
          "targetReps": <number_of_reps>,
          "restTimeSeconds": <rest_time_in_seconds>,
          "notes": "<optional_notes>"
        },
        ...
      ]
      
      Guidelines:
      - Select exercises that match the user's fitness level and goals
      - Use exercise IDs from the provided list
      - For strength: 3-5 sets of 6-12 reps
      - For endurance/fat loss: 3-4 sets of 12-20 reps
      - For flexibility: hold positions for 20-60 seconds
      - Rest times: 30-90 seconds for strength, 15-30 seconds for endurance
      
      **Output only the JSON array. Do not include explanations.**
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extract the JSON from the response
      let jsonText = text;

      // Remove markdown code block formatting if present
      jsonText = jsonText.replace(/```json\s+|\s+```/g, "");

      try {
        const workoutExercises = JSON.parse(jsonText);
        return workoutExercises;
      } catch (error) {
        // If direct parsing fails, try to extract JSON from the text
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw error;
      }
    } catch (error) {
      console.error("Error generating workout with Gemini:", error);
      throw new Error("Failed to generate workout program");
    }
  }
}
