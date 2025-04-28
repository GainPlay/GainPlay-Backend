import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ExerciseSetsService } from './exercise-sets.service';
import { CreateExerciseSetDto } from './dto/create-exercise-set.dto';
import { UpdateExerciseSetDto } from './dto/update-exercise-set.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ExerciseSetDto } from '@/models/exercise_sets/dto/exercise-set.dto';

@ApiTags('exercise-sets')
@Controller('exercise-sets')
export class ExerciseSetsController {
  constructor(private readonly exerciseSetsService: ExerciseSetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exercise set' })
  @ApiResponse({ status: 201, description: 'The exercise set has been created', type: ExerciseSetDto  })
  create(@Body() createExerciseSetDto: CreateExerciseSetDto) {
    return this.exerciseSetsService.create(createExerciseSetDto);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Create multiple exercise sets for a workout exercise' })
  @ApiResponse({ status: 201, description: 'The exercise sets have been created', type: [ExerciseSetDto] })
  @ApiQuery({ name: 'workoutExerciseId', type: Number, description: 'Workout exercise ID' })
  @ApiQuery({ name: 'count', type: Number, description: 'Number of sets to create' })
  @ApiQuery({ name: 'reps', type: Number, description: 'Number of reps for each set' })
  createMany(
    @Query('workoutExerciseId', ParseIntPipe) workoutExerciseId: number,
    @Query('count', ParseIntPipe) count: number,
    @Query('reps', ParseIntPipe) reps: number,
  ) {
    return this.exerciseSetsService.createMany(workoutExerciseId, count, reps);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exercise sets' })
  @ApiResponse({ status: 200, description: 'Return all exercise sets', type: [ExerciseSetDto] })
  findAll() {
    return this.exerciseSetsService.findAll();
  }

  @Get('workout-exercise/:id')
  @ApiOperation({ summary: 'Get all exercise sets for a workout exercise' })
  @ApiResponse({ status: 200, description: 'Return exercise sets for the workout exercise', type: [ExerciseSetDto] })
  @ApiParam({ name: 'id', description: 'Workout Exercise ID' })
  findByWorkoutExercise(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseSetsService.findByWorkoutExercise(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exercise set by ID' })
  @ApiResponse({ status: 200, description: 'Return the exercise set', type: ExerciseSetDto })
  @ApiResponse({ status: 404, description: 'Exercise set not found' })
  @ApiParam({ name: 'id', description: 'Exercise Set ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseSetsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exercise set' })
  @ApiResponse({ status: 200, description: 'The exercise set has been updated', type: ExerciseSetDto })
  @ApiResponse({ status: 404, description: 'Exercise set not found' })
  @ApiParam({ name: 'id', description: 'Exercise Set ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateExerciseSetDto: UpdateExerciseSetDto) {
    return this.exerciseSetsService.update(id, updateExerciseSetDto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark an exercise set as completed' })
  @ApiResponse({ status: 200, description: 'The exercise set has been marked as completed', type: ExerciseSetDto })
  @ApiResponse({ status: 404, description: 'Exercise set not found' })
  @ApiParam({ name: 'id', description: 'Exercise Set ID' })
  markAsCompleted(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseSetsService.markAsCompleted(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an exercise set' })
  @ApiResponse({ status: 204, description: 'The exercise set has been deleted' })
  @ApiResponse({ status: 404, description: 'Exercise set not found' })
  @ApiParam({ name: 'id', description: 'Exercise Set ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.exerciseSetsService.remove(id);
  }
}
