import { Injectable } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
      Create a personalized workout program based on the following user profile:
      ${JSON.stringify(userProfile, null, 2)}
      
      Return the workout program in the following JSON structure:
      {
        "program": {
          "name": "Program name based on user's goals",
          "duration": "Number of weeks",
          "schedule": [
            {
              "day": "Day number or name",
              "focus": "Body part or training type",
              "exercises": [
                {
                  "name": "Exercise name",
                  "sets": number,
                  "reps": number or range (e.g., "8-12"),
                  "rest": "Rest period in seconds",
                  "notes": "Any specific instructions"
                }
              ]
            }
          ]
        },
        "notes": "Any general advice or modifications based on user's condition"
      }
      
      Only return valid JSON, no other text.
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
