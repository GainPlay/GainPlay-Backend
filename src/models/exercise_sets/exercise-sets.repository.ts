// exercise-sets.repository.ts
import { Injectable } from '@nestjs/common';
import { exercise_sets as ExerciseSet } from '@prisma/client';
import { CreateExerciseSetDto } from './dto/create-exercise-set.dto';
import { UpdateExerciseSetDto } from './dto/update-exercise-set.dto';
import { PrismaService } from 'database/prisma.service';

@Injectable()
export class ExerciseSetsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateExerciseSetDto): Promise<ExerciseSet> {
    return this.prisma.exercise_sets.create({
      data,
    });
  }

  async findAll(): Promise<ExerciseSet[]> {
    return this.prisma.exercise_sets.findMany();
  }

  async findOne(id: number): Promise<ExerciseSet | null> {
    return this.prisma.exercise_sets.findUnique({
      where: { id },
    });
  }

  async findByWorkoutExercise(workoutExerciseId: number): Promise<ExerciseSet[]> {
    return this.prisma.exercise_sets.findMany({
      where: { workout_exercise_id: workoutExerciseId },
      orderBy: { set_number: 'asc' },
    });
  }

  async update(id: number, data: UpdateExerciseSetDto): Promise<ExerciseSet> {
    return this.prisma.exercise_sets.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<ExerciseSet> {
    return this.prisma.exercise_sets.delete({
      where: { id },
    });
  }

  async markAsCompleted(id: number): Promise<ExerciseSet> {
    return this.prisma.exercise_sets.update({
      where: { id },
      data: {
        completed: true,
        completed_at: new Date(),
      },
    });
  }
}