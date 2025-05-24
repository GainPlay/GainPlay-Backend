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
  const score = totalTargetReps > 0 ? Math.floor((totalCompletedReps / totalTargetReps) * 100) : 0;

  return { coins, experience_earned, score };
}
