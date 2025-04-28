import { Injectable, NotFoundException } from '@nestjs/common';
import { ExerciseSetsRepository } from './exercise-sets.repository';
import { CreateExerciseSetDto } from './dto/create-exercise-set.dto';
import { UpdateExerciseSetDto } from './dto/update-exercise-set.dto';
import { exercise_sets as ExerciseSet } from '@prisma/client';

@Injectable()
export class ExerciseSetsService {
  constructor(private repository: ExerciseSetsRepository) {}

  async create(createExerciseSetDto: CreateExerciseSetDto): Promise<ExerciseSet> {
    return this.repository.create(createExerciseSetDto);
  }

  async findAll(): Promise<ExerciseSet[]> {
    return this.repository.findAll();
  }

  async findByWorkoutExercise(workoutExerciseId: number): Promise<ExerciseSet[]> {
    return this.repository.findByWorkoutExercise(workoutExerciseId);
  }

  async findOne(id: number): Promise<ExerciseSet> {
    const exerciseSet = await this.repository.findOne(id);
    if (!exerciseSet) {
      throw new NotFoundException(`Exercise set with ID ${id} not found`);
    }
    return exerciseSet;
  }

  async update(id: number, updateExerciseSetDto: UpdateExerciseSetDto): Promise<ExerciseSet> {
    await this.findOne(id); // Will throw if not found
    return this.repository.update(id, updateExerciseSetDto);
  }

  async remove(id: number): Promise<ExerciseSet> {
    await this.findOne(id); // Will throw if not found
    return this.repository.remove(id);
  }

  async markAsCompleted(id: number): Promise<ExerciseSet> {
    await this.findOne(id); // Will throw if not found
    return this.repository.markAsCompleted(id);
  }

  async createMany(workoutExerciseId: number, setsCount: number, reps: number): Promise<ExerciseSet[]> {
    const createdSets: ExerciseSet[] = [];
    
    for (let i = 1; i <= setsCount; i++) {
      const setData: CreateExerciseSetDto = {
        workout_exercise_id: workoutExerciseId,
        set_number: i,
        reps,
        completed: false,
      };
      
      const createdSet = await this.repository.create(setData);
      createdSets.push(createdSet);
    }
    
    return createdSets;
  }
}