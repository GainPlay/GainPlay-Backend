import { Injectable } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { EXCERCISES } from "./constants"; // Assuming this file contains the exercises data

@Injectable()
export class GeminiService {
  private model;

  constructor() {
    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateWorkout(userProfile: any): Promise<any> {
    // Create a prompt that instructs Gemini to generate a structured workout
    const prompt = `
      You are an AI fitness coach. Your task is to create a customized workout plan based on a provided list of exercises and a user’s profile data.  

      ## **Available Exercises**
      Below is a table of available exercises:  

      ${EXCERCISES}

      ## **User Profile Data**
      The user has provided the following details about their physical status and goals:  
      ${userProfile}

      ## **Task**
      Based on the above data:
      - Select **appropriate exercises** from the provided list that match the user’s fitness level and goals.
      - Assign **realistic sets and reps** based on the goal:
        - **Muscle Gain**: 3-5 sets of 6-12 reps
        - **Fat Loss & Endurance**: 3-4 sets of 12-20 reps with minimal rest
        - **Flexibility**: Hold positions for 20-60 seconds
      - Set a reasonable **rest time** between sets:
        - **Strength Training**: 30-90 seconds
        - **Cardio & Endurance**: 15-30 seconds
        - **Flexibility**: No rest required
      - Format the response in the following structure:

      [ { "exercise_id": <exercise_id>, "target_sets": <number_of_sets>, "target_reps": <number_of_reps>, "rest_time_seconds": <rest_time_in_seconds> }, ... ]

      
      Ensure that:
      - The **exercise_id** matches an existing exercise in the provided table.
      - The workout is **balanced and achievable** based on the user’s profile.
      - Include **compound movements** for strength training, **high-rep circuits** for fat loss, and **dynamic/static stretches** for flexibility.

      **Output only the JSON response. Do not include explanations.**

    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extract the JSON from the response
      // Sometimes AI models might add explanation text despite instructions
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating workout with Gemini:", error);
      throw new Error("Failed to generate workout program");
    }
  }
}
