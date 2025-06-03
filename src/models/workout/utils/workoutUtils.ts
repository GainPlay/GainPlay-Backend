import { exercises } from "@prisma/client";

// Level progression configuration
const LEVEL_CONFIG = {
  baseXP: 500, // XP needed for level 1
  maxLevel: 100,
  multiplier: 1.2, // Each level requires 20% more XP than previous
};

// Reward configuration
const REWARD_CONFIG = {
  xp: {
    basePerRep: 0.2, // Further reduced from 0.5
    completionBonus: 2, // Further reduced from 5
    perfectSetBonus: 1, // Further reduced from 3
    difficultyMultiplier: 0.1, // Further reduced from 0.3
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
    totalXp += 20;
  }

  // Bonus for perfect form (completing many perfect sets)
  const perfectSetRatio = totalSets > 0 ? perfectSets / totalSets : 0;
  if (perfectSetRatio >= 0.8) {
    // 80% or more perfect sets
    totalCoins += 15; // Excellence bonus
    totalXp += 25;
  }

  // Perfect workout bonus (100% completion)
  if (score === 100) {
    totalCoins += REWARD_CONFIG.coins.perfectWorkoutBonus;
  }

  // Round coins to nearest integer
  const coins = Math.floor(totalCoins);
  const experience_earned = Math.floor(totalXp);

  return { coins, score, experience_earned };
}

export function calculateLevel(totalExperience: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progressToNextLevel: number;
} {
  let level = 1;
  let cumulativeXP = 0;
  let currentLevelRequiredXP = LEVEL_CONFIG.baseXP;

  // Calculate current level by checking cumulative XP thresholds
  while (level < LEVEL_CONFIG.maxLevel) {
    const xpNeededForNextLevel = Math.floor(
      LEVEL_CONFIG.baseXP * Math.pow(LEVEL_CONFIG.multiplier, level - 1),
    );

    if (totalExperience < cumulativeXP + xpNeededForNextLevel) {
      currentLevelRequiredXP = xpNeededForNextLevel;
      break;
    }

    cumulativeXP += xpNeededForNextLevel;
    level++;
  }

  // Calculate progress within current level
  const xpInCurrentLevel = totalExperience - cumulativeXP;
  const progressToNextLevel = Math.min(
    Math.floor((xpInCurrentLevel / currentLevelRequiredXP) * 100),
    100,
  );

  return {
    level,
    progressToNextLevel,
    currentLevelXP: xpInCurrentLevel,
    nextLevelXP: currentLevelRequiredXP,
  };
}

// Example workout rewards with balanced XP:
// Easy workout (difficulty 1-2, ~50 reps): ~30-40 coins, ~20-35 XP
// Medium workout (difficulty 3, ~75 reps): ~60-80 coins, ~35-50 XP
// Hard workout (difficulty 4-5, ~100 reps): ~100-150 coins, ~50-80 XP

// Level progression examples:
// Level 1→2: 500 XP (~10-25 perfect workouts)
// Level 2→3: 600 XP (~12-30 perfect workouts)
// Level 3→4: 720 XP (~14-36 perfect workouts)
// Level 4→5: 864 XP (~17-43 perfect workouts)
// Level 5→6: 1037 XP (~20-52 perfect workouts)

// With these values:
// - A perfect hard workout gives ~50-80 XP
// - You need 6-10 perfect hard workouts to reach level 2
// - Reaching level 5 requires 50-100+ workouts

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
