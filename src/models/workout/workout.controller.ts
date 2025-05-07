import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { WorkoutService } from "./workout.service";

@Controller("workout")
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post("generate")
  async generateWorkout(@Req() req) {
    try {
      const userId = req.user.id;
      return await this.workoutService.generateAndSaveWorkout(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || "Failed to generate workout program",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
