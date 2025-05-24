import { GoogleGenerativeAI } from "@google/generative-ai";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ExerciseFormatter } from "./utils/workoutUtils";
import { ExerciseService } from "../exercise/exercise.service";
import { UserGoalsService } from "../user_goal/user-goals.service";
import { UserSettingsService } from "../user_setting/user-settings.service";

@Injectable()
export class GeminiService {
  private model;

  constructor(
    private userGoalsService: UserGoalsService,
    private userSettingsService: UserSettingsService,
    private exerciseService: ExerciseService,
  ) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateWorkout(userId: number) {
    const [userGoals, userSettings, exercises] = await Promise.all([
      this.userGoalsService.findByUser(userId),
      this.userSettingsService.findByUser(userId).catch(() => null),
      this.exerciseService.findAll(),
    ]);

    console.log("User Goals:", userGoals);
    console.log("User Settings:", userSettings);
    console.log("Available Exercises Count:", exercises.length);

    if (!userGoals?.length && !userSettings) {
      throw new NotFoundException("User profile data not found");
    }

    if (!exercises?.length) {
      throw new NotFoundException("No exercises available in the database");
    }

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

    // Use the external formatter
    const formattedExercises =
      ExerciseFormatter.formatExercisesForPrompt(exercises);

    // Optional: Filter exercises based on user's fitness level
    const userFitnessLevel = userSettings?.fitness_level || 3;
    const appropriateExercises = ExerciseFormatter.filterByDifficulty(
      exercises,
      Math.max(1, userFitnessLevel - 1),
      Math.min(5, userFitnessLevel + 1),
    );

    console.log("User Profile Data:", userProfile);
    console.log("Filtered Exercises Count:", appropriateExercises.length);

    const prompt = `
      You are an AI fitness coach. Your task is to create a customized workout plan based on a provided list of exercises and a user's profile data.
      
      ## **Available Exercises**
      Below is a table of available exercises:
      
      ${formattedExercises}
      
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
      - Use ONLY exercise IDs from the provided list
      - For strength: 3-5 sets of 6-12 reps
      - For endurance/fat loss: 3-4 sets of 12-20 reps
      - For flexibility: hold positions for 20-60 seconds
      - Rest times: 30-90 seconds for strength, 15-30 seconds for endurance
      - Consider the muscle groups and difficulty levels when selecting exercises
      - Balance the workout to avoid overtraining specific muscle groups
      - Prioritize exercises with difficulty levels between ${Math.max(1, userFitnessLevel - 1)} and ${Math.min(5, userFitnessLevel + 1)}
      
      **Output only the JSON array. Do not include explanations.**
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      let jsonText = text;

      jsonText = jsonText.replace(/```json\s+|\s+```/g, "");

      try {
        const workoutExercises = JSON.parse(jsonText);

        // Validate that all exercise IDs exist in the database
        const exerciseIds = new Set(exercises.map(e => e.id));
        const validExercises = workoutExercises.filter(we =>
          exerciseIds.has(we.exerciseId),
        );

        if (validExercises.length === 0) {
          throw new Error("No valid exercises generated");
        }

        return validExercises;
      } catch (error) {
        // If direct parsing fails, try to extract JSON from the text
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);

          // Validate exercises
          const exerciseIds = new Set(exercises.map(e => e.id));
          const validExercises = parsed.filter(we =>
            exerciseIds.has(we.exerciseId),
          );

          if (validExercises.length === 0) {
            throw new Error("No valid exercises generated");
          }

          return validExercises;
        }
        throw error;
      }
    } catch (error) {
      console.error("Error generating workout with Gemini:", error);
      throw new Error("Failed to generate workout program");
    }
  }
}
