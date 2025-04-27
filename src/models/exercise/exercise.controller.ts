import { Controller, Get, Post, Param, Body, Put, NotFoundException } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { exercises } from '@prisma/client';  // Assuming 'exercises' is your Prisma model

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get(':id')
  async getExercise(@Param('id') id: number): Promise<exercises> {
    try {
      return await this.exerciseService.findById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  async getAllExercises(): Promise<exercises[]> {
    return await this.exerciseService.findAll();
  }

  @Post()
  async createExercise(@Body() exerciseData: Omit<exercises, 'id'>): Promise<exercises> {
    return await this.exerciseService.createExercise(exerciseData);
  }

  @Put(':id')
  async updateExercise(
    @Param('id') id: number,
    @Body() exerciseData: Partial<exercises>
  ): Promise<exercises> {
    try {
      return await this.exerciseService.updateExercise(id, exerciseData);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
