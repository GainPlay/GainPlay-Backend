// exercise-sets.repository.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { exercise_sets as ExerciseSet } from "@prisma/client";
import { CreateExerciseSetDto } from "./dto/create-exercise-set.dto";
import { UpdateExerciseSetDto } from "./dto/update-exercise-set.dto";

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

  async findByWorkoutExercise(
    workoutExerciseId: number,
  ): Promise<ExerciseSet[]> {
    return this.prisma.exercise_sets.findMany({
      orderBy: { set_number: "asc" },
      where: { workout_exercise_id: workoutExerciseId },
    });
  }

  async update(id: number, data: UpdateExerciseSetDto): Promise<ExerciseSet> {
    return this.prisma.exercise_sets.update({
      data,
      where: { id },
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
