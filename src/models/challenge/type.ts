import cron from "node-cron";

export type Challenge = {
  id: number;
  description: string;
  exercise: string;
  repetitions: number;
  intervals: number;
};

export const challenges: Challenge[] = [
  {
    id: 1,
    intervals: 5,
    repetitions: 50,
    exercise: "Push-ups",
    description: "Complete 50 Push-ups Today",
  },
  {
    id: 2,
    intervals: 4,
    repetitions: 100,
    exercise: "Jumping Jacks",
    description: "Do 100 Jumping Jacks",
  },
  {
    id: 3,
    intervals: 6,
    repetitions: 60,
    exercise: "Squats",
    description: "Perform 60 Squats",
  },
  {
    id: 4,
    intervals: 1,
    repetitions: 3,
    exercise: "Plank",
    description: "Hold a 3-Minute Plank",
  },
  {
    id: 5,
    intervals: 4,
    repetitions: 40,
    exercise: "Sit-ups",
    description: "Do 40 Sit-ups",
  },
  {
    id: 6,
    intervals: 3,
    repetitions: 30,
    exercise: "Burpees",
    description: "Complete 30 Burpees",
  },
  {
    id: 7,
    intervals: 1,
    repetitions: 10,
    exercise: "Running in Place",
    description: "Run in Place for 10 Minutes",
  },
  {
    id: 8,
    intervals: 4,
    repetitions: 70,
    exercise: "High Knees",
    description: "Perform 70 High Knees",
  },
  {
    id: 9,
    intervals: 3,
    repetitions: 45,
    exercise: "Mountain Climbers",
    description: "Do 45 Mountain Climbers",
  },
  {
    id: 10,
    intervals: 3,
    repetitions: 35,
    exercise: "Lunges",
    description: "Complete 35 Lunges",
  },
  {
    id: 11,
    intervals: 1,
    repetitions: 2,
    exercise: "Wall Sit",
    description: "Hold Wall Sit for 2 Minutes",
  },
  {
    id: 12,
    intervals: 4,
    repetitions: 80,
    exercise: "Arm Circles",
    description: "Perform 80 Arm Circles",
  },
  {
    id: 13,
    intervals: 2,
    repetitions: 25,
    exercise: "Leg Raises",
    description: "Do 25 Leg Raises",
  },
  {
    id: 14,
    intervals: 2,
    repetitions: 20,
    exercise: "Tricep Dips",
    description: "Complete 20 Tricep Dips",
  },
  {
    id: 15,
    intervals: 3,
    repetitions: 15,
    exercise: "Pull-ups",
    description: "Do 15 Pull-ups",
  },
  {
    id: 16,
    intervals: 1,
    repetitions: 1,
    exercise: "Boat Pose",
    description: "Hold Boat Pose for 1 Minute",
  },
  {
    id: 17,
    intervals: 5,
    repetitions: 50,
    exercise: "Calf Raises",
    description: "Do 50 Calf Raises",
  },
  {
    id: 18,
    intervals: 3,
    repetitions: 30,
    exercise: "Donkey Kicks",
    description: "Perform 30 Donkey Kicks",
  },
  {
    id: 19,
    intervals: 2,
    repetitions: 20,
    exercise: "Glute Bridges",
    description: "Do 20 Glute Bridges",
  },
  {
    id: 20,
    intervals: 1,
    repetitions: 5,
    exercise: "Full Body Stretch",
    description: "Stretch for 5 Minutes",
  },
];

let todayChallenge: Challenge | null = null;

export function generateDailyChallenge(): Challenge {
  const index = Math.floor(Math.random() * challenges.length);
  return challenges[index];
}

// Run once at start
todayChallenge = generateDailyChallenge();

// 🔁 Schedule to run at 00:00 every day
cron.schedule("0 0 * * *", () => {
  todayChallenge = generateDailyChallenge();
  console.log("New daily challenge generated:", todayChallenge);
});

// Expose current challenge (e.g. via Express or just log it)
export function getCurrentChallenge(): Challenge | null {
  return {
    id: 1,
    intervals: 5,
    repetitions: 50,
    exercise: "Push-ups",
    description: "Complete 50 Push-ups Today",
  }
  // return todayChallenge;
}

// Example usage
console.log("Current Challenge:", getCurrentChallenge());
