import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { GeminiService } from "./gemini.service";
import { UserProfileDto } from "./dto/user-profile.dto";
import { WorkoutResponseDto } from "./dto/workout-response.dto";

@Controller("workout")
export class WorkoutController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post("generate")
  async generateWorkout(
    @Req() req,
    @Body() userProfile: UserProfileDto,
  ): Promise<WorkoutResponseDto> {
    try {
      const user = req.user;
      console.log("User from request:", user);
      return await this.geminiService.generateWorkout(userProfile);
    } catch {
      throw new HttpException(
        "Failed to generate workout program",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
