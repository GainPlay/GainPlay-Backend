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

  @Get()
  async findAll(@Req() req) {
    const userId = req.user.id;
    return this.workoutService.findAll(userId);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.workoutService.findOne(id);
  }

  @Get("/currentWorkout")
  async findcurrentWorkout(@Req() req) {
    const userId = req.user.id;
    return this.workoutService.findcurrentWorkout(userId);
  }

  @Put("/finishWorkout")
  async finishWorkout(@Body() updateWorkoutDto: UpdateWorkoutDto) {
    return await this.workoutService.finishWorkout(updateWorkoutDto);
  }
}
