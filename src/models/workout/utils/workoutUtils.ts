import { exercises } from "@prisma/client";

// Reward configuration - adjusted so max XP per workout is 60-80
const REWARD_CONFIG = {
  xp: {
    basePerRep: 0.05, // Much lower to keep total XP under control
    completionBonus: 0.5, // Small bonus per set
    perfectSetBonus: 0.5, // Small perfect set bonus
    difficultyMultiplier: 0.02, // Very small difficulty bonus
  },
  coins: {
    basePerRep: 0.5, // Base coins per rep
    completionBonus: 2, // Bonus coins for completing a set
    perfectWorkoutBonus: 20, // Bonus for 100% completion
    difficultyMultiplier: 0.3, // Additional coins per difficulty level
  },
};

export function calculateWorkoutRewards(finishedWorkout: any): {
  coins: number;
  experience_earned: number;
  score: number;
} {
  let totalXp = 0;
  let totalCoins = 0;
  let completedSets = 0;
  let perfectSets = 0;
  let totalSets = 0;

  // For accurate scoring
  let totalSetScores = 0;
  let scorableSets = 0;

  for (const workoutExercise of finishedWorkout.workout_exercises) {
    const difficulty = workoutExercise.exercises?.difficulty_level ?? 1;

    // Get target reps from exercise template
    const targetRepsPerSet =
      workoutExercise.exercise_templates?.target_reps || 10;

    for (const exerciseSet of workoutExercise.exercise_sets) {
      const completedReps = exerciseSet.completed_reps ?? 0;
      const targetReps = exerciseSet.reps ?? targetRepsPerSet;

      totalSets++;

      // Calculate individual set score (0-100)
      if (targetReps > 0) {
        const setScore = Math.min((completedReps / targetReps) * 100, 100);
        totalSetScores += setScore;
        scorableSets++;
      }

      if (completedReps > 0) {
        // Calculate XP
        const baseXp = completedReps * REWARD_CONFIG.xp.basePerRep;
        const difficultyBonus =
          completedReps * difficulty * REWARD_CONFIG.xp.difficultyMultiplier;
        const setCompletionBonus = REWARD_CONFIG.xp.completionBonus;

        let setXp = baseXp + difficultyBonus + setCompletionBonus;

        // Perfect set bonus
        if (completedReps >= targetReps) {
          setXp += REWARD_CONFIG.xp.perfectSetBonus;
          perfectSets++;
        }

        totalXp += Math.floor(setXp);
        completedSets++;

        // Calculate Coins
        const baseCoins = completedReps * REWARD_CONFIG.coins.basePerRep;
        const difficultyCoinsBonus =
          completedReps * difficulty * REWARD_CONFIG.coins.difficultyMultiplier;
        const setCompletionCoinsBonus = REWARD_CONFIG.coins.completionBonus;

        totalCoins +=
          baseCoins + difficultyCoinsBonus + setCompletionCoinsBonus;
      }
    }
  }

  // Calculate completion score based on average of all set scores
  const score =
    scorableSets > 0 ? Math.floor(totalSetScores / scorableSets) : 0;

  // Bonus for completing many sets (endurance bonus)
  if (completedSets >= 10) {
    totalCoins += 10; // Bonus for completing 10+ sets
    totalXp += 5; // Very small XP bonus
  }

  // Bonus for perfect form (completing many perfect sets)
  const perfectSetRatio = totalSets > 0 ? perfectSets / totalSets : 0;
  if (perfectSetRatio >= 0.8) {
    // 80% or more perfect sets
    totalCoins += 15; // Excellence bonus
    totalXp += 5; // Very small XP bonus
  }

  // Perfect workout bonus (100% completion)
  if (score === 100) {
    totalCoins += REWARD_CONFIG.coins.perfectWorkoutBonus;
    totalXp += 5; // Very small XP bonus for perfect workout
  }

  // Cap XP at 80 per workout to ensure it takes multiple workouts to level up
  const experience_earned = Math.min(Math.floor(totalXp), 80);
  const coins = Math.floor(totalCoins);

  return { coins, score, experience_earned };
}

// Example workout rewards with simple level formula (level = floor(total_xp / 100)):
// Easy workout (difficulty 1-2, ~50 reps): ~30-40 coins, ~10-20 XP
// Medium workout (difficulty 3, ~75 reps): ~60-80 coins, ~20-40 XP
// Hard workout (difficulty 4-5, ~100 reps): ~100-150 coins, ~40-60 XP
// Perfect hard workout (100% completion): ~120-170 coins, ~60-80 XP (capped at 80)

// Level progression with formula level = floor(total_xp / 100):
// Level 1: 0-99 XP (2-10 workouts)
// Level 2: 100-199 XP (4-20 workouts total)
// Level 3: 200-299 XP (6-30 workouts total)
// Level 4: 300-399 XP (8-40 workouts total)
// Level 5: 400-499 XP (10-50 workouts total)
// etc...

// Helper function to get level milestones
export function getLevelMilestones(currentLevel: number): {
  nextMilestone: number;
  milestoneName: string;
  reward: string;
} {
  const milestones = [
    { level: 5, name: "Fitness Rookie", reward: "Unlock special avatar" },
    { level: 10, reward: "50 bonus coins", name: "Dedicated Athlete" },
    { level: 15, reward: "Exclusive badge", name: "Fitness Enthusiast" },
    { level: 20, name: "Workout Warrior", reward: "100 bonus coins" },
    { level: 25, name: "Exercise Expert", reward: "Legendary avatar unlock" },
    { level: 30, name: "Fitness Master", reward: "200 bonus coins" },
    { level: 40, name: "Elite Performer", reward: "Special effects" },
    { level: 50, name: "Legendary Athlete", reward: "500 bonus coins" },
  ];

  const nextMilestone = milestones.find(m => m.level > currentLevel);

  if (nextMilestone) {
    return {
      reward: nextMilestone.reward,
      milestoneName: nextMilestone.name,
      nextMilestone: nextMilestone.level,
    };
  }

  return {
    nextMilestone: 100,
    reward: "Eternal glory",
    milestoneName: "Ultimate Champion",
  };
}

// Format exercises utility functions remain the same
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
