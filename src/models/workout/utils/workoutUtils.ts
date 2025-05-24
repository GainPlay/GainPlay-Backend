import { exercises } from "@prisma/client";

export function calculateWorkoutRewards(finishedWorkout: any): {
  coins: number;
  experience_earned: number;
  score: number;
} {
  let totalCompletedReps = 0;
  let totalTargetReps = 0;
  let totalXp = 0;

  for (const workoutExercise of finishedWorkout.workout_exercises) {
    const difficulty = workoutExercise.exercises?.difficulty_level ?? 1;

    for (const exerciseSet of workoutExercise.exercise_sets) {
      const completedReps = exerciseSet.completed_reps ?? 0;
      const targetReps = exerciseSet.reps ?? 0;

      totalCompletedReps += completedReps;
      totalTargetReps += targetReps;

      if (completedReps > 0) {
        totalXp += difficulty * 50;
      }
    }
  }

  const coins = Math.floor(totalCompletedReps / 10);
  const experience_earned = totalXp;
  const score =
    totalTargetReps > 0
      ? Math.floor((totalCompletedReps / totalTargetReps) * 100)
      : 0;

  return { coins, score, experience_earned };
}

// utils/format-exercises.util.ts

export class ExerciseFormatter {
  /**
   * Formats exercises array into a markdown table for Gemini prompt
   */
  static formatExercisesForPrompt(exercises: exercises[]): string {
    const header =
      "| ID | Name | Description | Category | Difficulty | Muscle Group |";
    const separator = "|---|---|---|---|---|---|";

    const rows = exercises.map(
      exercise =>
        `| ${exercise.id} | ${exercise.name || "N/A"} | ${exercise.description || "N/A"} | ${exercise.category || "N/A"} | ${exercise.difficulty_level || "N/A"} | ${exercise.muscle_group || "N/A"} |`,
    );

    return [header, separator, ...rows].join("\n");
  }

  /**
   * Formats exercises array into a structured format if needed
   */
  static formatExercisesAsJson(exercises: exercises[]): string {
    return JSON.stringify(
      exercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        description: exercise.description,
        muscle_group: exercise.muscle_group,
        difficulty_level: exercise.difficulty_level,
      })),
      null,
      2,
    );
  }

  /**
   * Groups exercises by category
   */
  static groupExercisesByCategory(
    exercises: exercises[],
  ): Record<string, exercises[]> {
    return exercises.reduce(
      (acc, exercise) => {
        const category = exercise.category || "Uncategorized";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(exercise);
        return acc;
      },
      {} as Record<string, exercises[]>,
    );
  }

  /**
   * Groups exercises by muscle group
   */
  static groupExercisesByMuscleGroup(
    exercises: exercises[],
  ): Record<string, exercises[]> {
    return exercises.reduce(
      (acc, exercise) => {
        const muscleGroup = exercise.muscle_group || "Other";
        if (!acc[muscleGroup]) {
          acc[muscleGroup] = [];
        }
        acc[muscleGroup].push(exercise);
        return acc;
      },
      {} as Record<string, exercises[]>,
    );
  }

  /**
   * Filters exercises by difficulty level
   */
  static filterByDifficulty(
    exercises: exercises[],
    minDifficulty: number,
    maxDifficulty: number,
  ): exercises[] {
    return exercises.filter(exercise => {
      const difficulty = exercise.difficulty_level || 0;
      return difficulty >= minDifficulty && difficulty <= maxDifficulty;
    });
  }
}
