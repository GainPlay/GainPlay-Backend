import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { GeminiService } from "./gemini.service";
import { WorkoutResponseDto } from "./dto/workout-response.dto";

@Controller("workout")
export class WorkoutController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post("generate")
  async generateWorkout(@Req() req): Promise<WorkoutResponseDto> {
    try {
      const userId = req.user.id;

      return await this.geminiService.generateWorkout(userId);
    } catch {
      throw new HttpException(
        "Failed to generate workout program",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
