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
    const workoutResponse = await this.geminiService.generateWorkout(userId);

    // Create a workout record in the database
    const workout = await this.prisma.workouts.create({
      data: {
        user_id: userId,
        coins_earned: 0, // You can set this later when the workout is completed
        started_at: new Date(),
      },
    });

    // Process each day's exercises and create workout_exercises records
    const workoutExercisesData = [];

    // Flatten the schedule to get all exercises
    workoutResponse.program.schedule.forEach(day => {
      day.exercises.forEach(exercise => {
        // You'll need to find the exercise ID based on the exercise name
        // This assumes you have a way to map exercise names to IDs
        const exerciseData = {
          exercise_id: null, // We'll set this in the next step
          notes: exercise.notes,
          workout_id: workout.id,
          rest_time: exercise.rest,
          target_sets: exercise.sets,
          target_reps: exercise.reps,
          exercise_name: exercise.name,
        };

        workoutExercisesData.push(exerciseData);
      });
    });

    // Now find exercise IDs and create workout_exercises records
    const createdWorkoutExercises = [];

    for (const exerciseData of workoutExercisesData) {
      // Find exercise by name (assuming your exercises table has names)
      const exercise = await this.prisma.exercises.findFirst({
        where: {
          name: exerciseData.exercise_name,
        },
      });

      if (exercise) {
        const workoutExercise = await this.prisma.workout_exercises.create({
          data: {
            total_reps: 0, // Will be updated as user completes sets
            workout_id: workout.id,
            exercise_id: exercise.id,
          },
        });

        createdWorkoutExercises.push({
          ...workoutExercise,
          notes: exerciseData.notes,
          rest_time: exerciseData.rest_time,
          target_sets: exerciseData.target_sets,
          target_reps: exerciseData.target_reps,
        });
      }
    }

    // Return the complete workout with associated exercises
    return {
      ...workout,
      exercises: createdWorkoutExercises,
      original_response: workoutResponse,
    };
  }
}
