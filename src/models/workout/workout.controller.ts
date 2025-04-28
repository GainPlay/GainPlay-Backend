import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { GeminiService } from "./gemini.service";
import { UserProfileDto } from "./dto/user-profile.dto";
import { WorkoutResponseDto } from "./dto/workout-response.dto";

@Controller("workout")
export class WorkoutController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post("generate")
  async generateWorkout(
    @Body() userProfile: string,
  ): Promise<WorkoutResponseDto> {
    try {
      return await this.geminiService.generateWorkout(userProfile);
    } catch (error) {
      throw new HttpException(
        "Failed to generate workout program",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
