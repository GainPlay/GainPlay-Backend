import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { GeminiService } from "./gemini.service";

@Injectable()
export class WorkoutService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
  ) {}

  async generateAndSaveWorkout(userId: number) {
    const workoutExercises = await this.geminiService.generateWorkout(userId);

    const workout = await this.prisma.workouts.create({
      data: {
        user_id: userId,
        coins_earned: 0,
        started_at: new Date(),
      },
    });

    const createdWorkoutExercises = [];

    for (const exercise of workoutExercises) {
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
          total_reps: 0,
          workout_id: workout.id,
          exercise_id: exercise.exerciseId,
          template_id: exerciseTemplate.id,
        },
      });

      const exerciseSets = [];
      for (let i = 1; i <= exercise.targetSets; i++) {
        const set = await this.prisma.exercise_sets.create({
          data: {
            reps: 0,
            set_number: i,
            completed: false,
            workout_exercise_id: workoutExercise.id,
          },
        });
        exerciseSets.push(set);
      }

      createdWorkoutExercises.push({
        ...workoutExercise,
        sets: exerciseSets,
        notes: exercise.notes,
        target_sets: exercise.targetSets,
        target_reps: exercise.targetReps,
        rest_time: exercise.restTimeSeconds,
        exercise_name: exercise.exerciseName,
      });
    }

    return {
      ...workout,
      exercises: createdWorkoutExercises,
    };
  }
}
