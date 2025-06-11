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
    intervals: 5,
    repetitions: 50,
    exercise: "Jumping Jacks",
    description: "Do 50 Jumping Jacks",
  },
  {
    id: 3,
    intervals: 5,
    repetitions: 50,
    exercise: "Squats",
    description: "Perform 50 Squats",
  },
  ,
  {
    id: 4,
    intervals: 5,
    repetitions: 50,
    exercise: "Donkey Kicks",
    description: "Perform 50 Donkey Kicks",
  },
  {
    id: 5,
    intervals: 5,
    repetitions: 50,
    exercise: "Sit-ups",
    description: "Do 50 Sit-ups",
  },
  {
    id: 6,
    intervals: 5,
    repetitions: 50,
    exercise: "Burpees",
    description: "Complete 50 Burpees",
  },
  {
    id: 7,
    intervals: 5,
    repetitions: 50,
    exercise: "Glute Bridges",
    description: "Do 50 Glute Bridges",
  },
  {
    id: 8,
    intervals: 5,
    repetitions: 50,
    exercise: "High Knees",
    description: "Perform 50 High Knees",
  },
  {
    id: 9,
    intervals: 5,
    repetitions: 50,
    exercise: "Mountain Climbers",
    description: "Do 50 Mountain Climbers",
  },
  {
    id: 10,
    intervals: 5,
    repetitions: 50,
    exercise: "Lunges",
    description: "Complete 50 Lunges",
  },
  {
    id: 11,
    intervals: 5,
    repetitions: 50,
    exercise: "Calf Raises",
    description: "Do 50 Calf Raises",
  },
  {
    id: 12,
    intervals: 5,
    repetitions: 50,
    exercise: "Arm Circles",
    description: "Perform 50 Arm Circles",
  },
  {
    id: 13,
    intervals: 5,
    repetitions: 50,
    exercise: "Leg Raises",
    description: "Do 50 Leg Raises",
  },
  {
    id: 14,
    intervals: 5,
    repetitions: 50,
    exercise: "Tricep Dips",
    description: "Complete 50 Tricep Dips",
  },
  {
    id: 15,
    intervals: 5,
    repetitions: 50,
    exercise: "Pull-ups",
    description: "Do 50 Pull-ups",
  }
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
});

// Expose current challenge (e.g. via Express or just log it)
export function getCurrentChallenge(): Challenge | null {
  return todayChallenge;
}