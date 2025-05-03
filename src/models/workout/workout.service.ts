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

    // Create workout_exercises records and related records
    const createdWorkoutExercises = [];

    for (const exercise of workoutExercises) {
      // 1. Create or find exercise_template
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

      // 2. Create workout_exercise
      const workoutExercise = await this.prisma.workout_exercises.create({
        data: {
          total_reps: 0, // Will be updated as user completes sets
          workout_id: workout.id,
          exercise_id: exercise.exerciseId,
          template_id: exerciseTemplate.id,
        },
      });

      // 3. Create exercise_sets (one for each set)
      const exerciseSets = [];
      for (let i = 1; i <= exercise.targetSets; i++) {
        const set = await this.prisma.exercise_sets.create({
          data: {
            reps: 0, // Will be updated as user completes the set
            set_number: i,
            completed: false,
            workout_exercise_id: workoutExercise.id,
          },
        });
        exerciseSets.push(set);
      }

      // Add exercise to response with template and sets
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

    // Return the complete workout with associated exercises and sets
    return {
      ...workout,
      exercises: createdWorkoutExercises,
    };
  }
}
