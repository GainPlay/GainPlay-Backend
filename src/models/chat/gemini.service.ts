import { Injectable } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageRequestDto } from "@/models/chat/dto/message-request.dto";
import { UserSettingsService } from "../user_setting/user-settings.service";

@Injectable()
export class GeminiService {
  private model;

  constructor(private userSettingsService: UserSettingsService) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateAnswer(question: MessageRequestDto) {
    // const [userSettings] = await Promise.all([
    //   this.userSettingsService.findByUser(question.userId).catch(() => null),
    // ]);

    // if (!userSettings) {
    //   throw new NotFoundException("User profile data not found");
    // }

    const prompt = `
      You are an intelligent and helpful exercise assistant. Your goal is to provide informative and encouraging responses to user questions related to workouts, fitness, nutrition, and overall well-being.

      The user's question is: "${question.message}".

      Please provide a concise and helpful answer to this question, formatted as a JSON object with the following structure:

      {
        "text": "YOUR_ANSWER_HERE"
      }

      Make it a plain, very 1 sentence answer without any code blocks or markdown formatting . 
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      let jsonText = text;

      jsonText = jsonText.replace(/```json\s+|\s+```/g, "");

      try {
        const answer = JSON.parse(jsonText);
        return answer;
      } catch (error) {
        // If direct parsing fails, try to extract JSON from the text
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw error;
      }
    } catch (error) {
      console.error("Error generating answer with Gemini:", error);
      throw new Error("Failed to generate answer ");
    }
  }
}
