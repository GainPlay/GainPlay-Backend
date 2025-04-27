import { GoogleGenerativeAI } from "@google/generative-ai";
import { Injectable, NotFoundException } from "@nestjs/common";
import { EXCERCISES } from "./constants";
import { GoalsService } from "../goal/goals.service";
import { UserGoalsService } from "../user_goal/user-goals.service";
import { UserSettingsService } from "../user_setting/user-settings.service";

interface WorkoutExercise {
  exerciseId: number;
  targetSets: number;
  targetReps: number;
  restTimeSeconds: number;
  exerciseName?: string;
}

@Injectable()
export class GeminiService {
  private model;
  private exerciseMap: Record<number, string>;

  constructor(
    private userGoalsService: UserGoalsService,
    private userSettingsService: UserSettingsService,
    private goalsService: GoalsService,
  ) {
    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const exerciseArray = JSON.parse(EXCERCISES);
    this.exerciseMap = exerciseArray.reduce(
      (acc, exercise) => {
        acc[exercise.id] = exercise.name;
        return acc;
      },
      {} as Record<number, string>,
    );
  }

  async generateWorkout(userId: number): Promise<WorkoutExercise[]> {
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
      Based on the above data:
      - Select **appropriate exercises** from the provided list that match the user's fitness level and goals.
      - Assign **realistic sets and reps** based on the goal:
        - **Muscle Gain**: 3-5 sets of 6-12 reps
        - **Fat Loss & Endurance**: 3-4 sets of 12-20 reps with minimal rest
        - **Flexibility**: Hold positions for 20-60 seconds
      - Set a reasonable **rest time** between sets:
        - **Strength Training**: 30-90 seconds
        - **Cardio & Endurance**: 15-30 seconds
        - **Flexibility**: No rest required
      - Format the response in the following structure:
      
      [
        {
          "exerciseId": <exercise_id>,
          "targetSets": <number_of_sets>,
          "targetReps": <number_of_reps>,
          "restTimeSeconds": <rest_time_in_seconds>
        },
        ...
      ]
      
      Ensure that:
      - The **exercise_id** matches an existing exercise in the provided table.
      - The workout is **balanced and achievable** based on the user's profile.
      - Include **compound movements** for strength training, **high-rep circuits** for fat loss, and **dynamic/static stretches** for flexibility.
      
      **Output only the JSON response. Do not include explanations.**
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extract the JSON from the response
      let jsonText = text;

      // Remove markdown code block formatting if present
      jsonText = jsonText.replace(/```json\s+|\s+```/g, "");

      const workoutArray = JSON.parse(jsonText);

      const workoutWithNames = workoutArray.map(workout => ({
        ...workout,
        exerciseName:
          this.exerciseMap[workout.exerciseId] || "Unknown Exercise",
      }));

      return workoutWithNames;
    } catch (error) {
      console.error("Error generating workout with Gemini:", error);
      throw new Error("Failed to generate workout program");
    }
  }
}
