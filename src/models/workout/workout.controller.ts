import { UpdateWorkoutDto } from "@/models/workout/dto/updateWorkoutDto";
import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Req,
  Put,
  Body,
  Get,
  ParseIntPipe,
  Query,
  Param,
} from "@nestjs/common";
import { WorkoutService } from "./workout.service";
import { log } from "console";

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
      throw new HttpException(error.message || "Failed to generate workout program", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Req() req) {
    const userId = req.user.id;
    return this.workoutService.findAll(userId);
  }

  @Get("/current")
  async findcurrentWorkout(@Req() req) {
    const userId = req.user.id;
    return this.workoutService.findcurrentWorkout(userId);
  }

  @Put("/finishWorkout")
  async finishWorkout(
    @Body() finishedWorkout: any
  ): Promise<{ coins: number; experience_earned: number; score: number }> {
    return await this.workoutService.finishWorkout(finishedWorkout);
  }
}
