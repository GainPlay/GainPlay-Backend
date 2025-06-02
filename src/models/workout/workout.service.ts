import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { BadgesService } from "@/models/badge/badges.service"; // Add this import
import {
  calculateWorkoutRewards,
  calculateLevel,
} from "@/models/workout/utils/workoutUtils";
import { GeminiService } from "./gemini.service";

@Injectable()
export class WorkoutService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
    private badgesService: BadgesService,
  ) {}

  async generateAndSaveWorkout(userId: number) {
    const existingWorkout = await this.prisma.workouts.findFirst({
      where: {
        user_id: userId,
        completed_at: null,
      },
      include: {
        workout_exercises: {
          select: { id: true },
        },
      },
    });

    // 2. If found, delete all related sets and exercises
    if (existingWorkout) {
      const workoutExerciseIds = existingWorkout.workout_exercises.map(
        we => we.id,
      );

      // Delete related exercise_sets
      await this.prisma.exercise_sets.deleteMany({
        where: {
          workout_exercise_id: { in: workoutExerciseIds },
        },
      });

      // Delete workout_exercises
      await this.prisma.workout_exercises.deleteMany({
        where: {
          id: { in: workoutExerciseIds },
        },
      });

      // Delete the workout itself
      await this.prisma.workouts.delete({
        where: {
          id: existingWorkout.id,
        },
      });
    }

    const generatedWorkoutExercises =
      await this.geminiService.generateWorkout(userId);

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

    this.updateFinishOnboarding(userId);

    return this.findcurrentWorkout(userId);
  }

  async updateFinishOnboarding(userId: number) {
    await this.prisma.users.update({
      where: { id: userId },
      data: { finished_onboarding: true },
    });
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

  async finishWorkout(finishedWorkout: any): Promise<{
    coins: number;
    experience_earned: number;
    score: number;
    levelUp: boolean;
    newLevel: number;
    progressToNextLevel: number;
    newBadges?: any[];
  }> {
    const { coins, score, experience_earned } =
      calculateWorkoutRewards(finishedWorkout);

    let levelUp = false;
    let newLevel = 1;
    let progressToNextLevel = 0;
    let userId: number;

    await this.prisma.$transaction(async tx => {
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

      userId = workout.user_id; // Store userId for badge checking

      // Get current user data
      const currentUser = await tx.users.findUnique({
        where: { id: workout.user_id },
        select: { level: true, experience: true },
      });

      const oldLevel = currentUser.level || 1;
      const newTotalExperience =
        (currentUser.experience || 0) + experience_earned;

      // Calculate new level
      const levelInfo = calculateLevel(newTotalExperience);
      newLevel = levelInfo.level;
      progressToNextLevel = levelInfo.progressToNextLevel;
      levelUp = newLevel > oldLevel;

      // Update user XP, coins, and level
      await tx.users.update({
        where: {
          id: workout.user_id,
        },
        data: {
          level: newLevel,
          coins: { increment: coins },
          experience: { increment: experience_earned },
        },
      });

      // If user leveled up, you could add additional rewards here
      if (levelUp) {
        // Example: Give bonus coins for leveling up
        const levelUpBonus = newLevel * 10; // 10 coins per level
        await tx.users.update({
          where: { id: workout.user_id },
          data: { coins: { increment: levelUpBonus } },
        });

        console.log(
          `User leveled up to ${newLevel}! Bonus: ${levelUpBonus} coins`,
        );
      }

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

    const newBadges = await this.badgesService.checkAndAwardBadges(userId);

    return {
      coins,
      score,
      levelUp,
      newLevel,
      experience_earned,
      progressToNextLevel,
      newBadges: newBadges.length > 0 ? newBadges : undefined,
    };
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
