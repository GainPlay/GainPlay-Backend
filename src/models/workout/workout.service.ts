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
    // First, generate the workout using Gemini
    const workoutExercises = await this.geminiService.generateWorkout(userId);

    // Create a workout record in the database
    const workout = await this.prisma.workouts.create({
      data: {
        user_id: userId,
        coins_earned: 0, // You can set this later when the workout is completed
        started_at: new Date(),
      },
    });

    // Create workout_exercises records
    const createdWorkoutExercises = [];

    for (const exercise of workoutExercises) {
      const workoutExercise = await this.prisma.workout_exercises.create({
        data: {
          total_reps: 0, // Will be updated as user completes sets
          workout_id: workout.id,
          exercise_id: exercise.exerciseId,
        },
      });

      createdWorkoutExercises.push({
        ...workoutExercise,
        notes: exercise.notes,
        target_sets: exercise.targetSets,
        target_reps: exercise.targetReps,
        rest_time: exercise.restTimeSeconds,
        exercise_name: exercise.exerciseName,
      });
    }

    // Return the complete workout with associated exercises
    return {
      ...workout,
      exercises: createdWorkoutExercises,
    };
  }
}
