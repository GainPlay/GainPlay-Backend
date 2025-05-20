import { workouts } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { calcWorkoutCoins } from "@/models/workout/utils/workoutUtils";
import { UpdateWorkoutDto } from "@/models/workout/dto/updateWorkoutDto";
import { GeminiService } from "./gemini.service";

@Injectable()
export class WorkoutService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
  ) {}

  async generateAndSaveWorkout(userId: number) {
    const generatedWorkoutExercises = await this.geminiService.generateWorkout(userId);

     const workout = await this.prisma.workouts.create({
      data: {
        user_id: userId,
      },
    });

    for (const exercise of generatedWorkoutExercises) {
      let exerciseTemplate = await this.prisma.exercise_templates.findFirst({
        where: {
          exercise_id: exercise.exerciseId,
          target_sets: exercise.targetSets,
          target_reps: exercise.targetReps,
          rest_time_seconds: exercise.restTimeSeconds,
        },
      });

      if (!exerciseTemplate) {
        exerciseTemplate = await this.prisma.exercise_templates.create({
          data: {
            exercise_id: exercise.exerciseId,
            target_sets: exercise.targetSets,
            target_reps: exercise.targetReps,
            rest_time_seconds: exercise.restTimeSeconds,
          },
        });
      }

      const workoutExercise = await this.prisma.workout_exercises.create({
        data: {
          workout_id: workout.id,
          exercise_id: exercise.exerciseId,
          template_id: exerciseTemplate.id,
        },
      });

      for (let i = 1; i <= exercise.targetSets; i++) {
        await this.prisma.exercise_sets.create({
          data: {
            reps: exercise.targetReps,
            completed_reps: 0,
            set_number: i,
            workout_exercise_id: workoutExercise.id,
          },
        });
      }
    }

    return this.findcurrentWorkout(userId);
  }

  async findAll(userId: number) {
    return await this.prisma.workouts.findMany({
      where: { user_id: userId },
      include: {
        workout_exercises: {
          include: {
            exercise_sets: true,
            exercises: true,
            exercise_templates: true,
          },
        },
      },
    });
  }
  
  async findOne(id: number) {
    return await this.prisma.workouts.findUnique({
      where: { id },
      include: {
        workout_exercises: {
          include: {
            exercise_sets: true,
            exercises: true,
            exercise_templates: true,
          },
        },
      },
    });
  }
  
  async findcurrentWorkout(userId: number) {
    return await this.prisma.workouts.findFirst({
      where: {
        user_id: userId,
        completed_at: null,
      },
      include: {
        workout_exercises: {
          include: {
            exercise_sets: true,
            exercises: true,
            exercise_templates: true,
          },
        },
      },
    });
  }
  

  async finishWorkout(updateWorkoutDto: UpdateWorkoutDto): Promise<workouts> {
    const coins = calcWorkoutCoins(updateWorkoutDto);

    return await this.prisma.$transaction(async tx => {
      const workout = await tx.workouts.update({
        where: {
          id: updateWorkoutDto.id,
        },
        data: {
          coins_earned: coins,
          completed_at: new Date().toISOString(),
        },
      });

      await tx.users.update({
        where: {
          id: workout.user_id,
        },
        data: {
          coins: {
            increment: coins,
          },
        },
      });
      return workout;
    });
  }
}
