import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { calculateWorkoutRewards } from "@/models/workout/utils/workoutUtils";
import { GeminiService } from "./gemini.service";

@Injectable()
export class WorkoutService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
  ) {}

  async generateAndSaveWorkout(userId: number) {
    const generatedWorkoutExercises =
      await this.geminiService.generateWorkout(userId);

    console.log("Generated Workout Exercises:", generatedWorkoutExercises);
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
            set_number: i,
            completed_reps: 0,
            reps: exercise.targetReps,
            workout_exercise_id: workoutExercise.id,
          },
        });
      }
    }

    return this.findcurrentWorkout(userId);
  }

  async findAll(userId: number) {
    const workouts = await this.prisma.workouts.findMany({
      where: { user_id: userId },
      select: {
        started_at: true,
        experience_earned: true,
        workout_exercises: {
          select: {
            exercise_sets: true,
            exercises: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return workouts.map(workout => {
      return {
        date: workout.started_at,
        exercises: workout.workout_exercises.map(exercise => {
          return {
            name: exercise.exercises.name,
            xpEarned: workout.experience_earned,
            totalReps: exercise.exercise_sets.reduce(
              (total, set) => total + (set.completed_reps || 0),
              0,
            ),
            sets: exercise.exercise_sets.map(set => {
              return {
                reps: set.reps,
                completed: set.completed_reps >= set.reps,
              };
            }),
          };
        }),
      };
    });
  }

  async findOne(id: number) {
    return await this.prisma.workouts.findUnique({
      where: { id },
      include: {
        workout_exercises: {
          include: {
            exercises: true,
            exercise_sets: true,
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
            exercises: true,
            exercise_sets: true,
            exercise_templates: true,
          },
        },
      },
    });
  }

  async finishWorkout(
    finishedWorkout: any,
  ): Promise<{ coins: number; experience_earned: number; score: number }> {
    const { coins, score, experience_earned } =
      calculateWorkoutRewards(finishedWorkout);

    await this.prisma.$transaction(async tx => {
      // Update the completed workout
      const workout = await tx.workouts.update({
        where: {
          id: finishedWorkout.id,
        },
        data: {
          score,
          experience_earned,
          coins_earned: coins,
          completed_at: new Date().toISOString(),
        },
      });

      // Update user XP and coins
      await tx.users.update({
        where: {
          id: workout.user_id,
        },
        data: {
          coins: { increment: coins },
          experience: { increment: experience_earned },
        },
      });

      // Update all sets with completed reps
      for (const workoutExercise of finishedWorkout.workout_exercises) {
        for (const exerciseSet of workoutExercise.exercise_sets) {
          await tx.exercise_sets.update({
            where: {
              id: exerciseSet.id,
            },
            data: {
              completed_reps: exerciseSet.completed_reps,
            },
          });
        }
      }

      // Create a duplicate workout
      await this.duplicateWorkout(finishedWorkout);
    });

    return { coins, score, experience_earned };
  }

  async duplicateWorkout(finishedWorkout: any): Promise<any> {
    // Create the new workout (not yet completed)
    const newWorkout = await this.prisma.workouts.create({
      data: {
        completed_at: null,
        coins_earned: null,
        started_at: new Date(),
        user_id: finishedWorkout.user_id,
      },
    });

    // Loop through each workout exercise and recreate
    for (const we of finishedWorkout.workout_exercises) {
      const newWorkoutExercise = await this.prisma.workout_exercises.create({
        data: {
          workout_id: newWorkout.id,
          exercise_id: we.exercise_id,
          template_id: we.template_id,
        },
      });

      // Duplicate sets (same reps, set number, but completed_reps set to 0)
      for (const set of we.exercise_sets) {
        await this.prisma.exercise_sets.create({
          data: {
            reps: set.reps,
            completed_reps: 0,
            set_number: set.set_number,
            workout_exercise_id: newWorkoutExercise.id,
          },
        });
      }
    }
  }
}
