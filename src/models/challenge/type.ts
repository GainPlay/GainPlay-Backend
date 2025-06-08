import cron from "node-cron";

export type Challenge = {
  id: number;
  description: string;
  exercise: string;
  repetitions: number;
  intervals: number;
};

export const challenges: Challenge[] = [
  { id: 1, intervals: 4, repetitions: 40, exercise: "Push-ups", description: "Complete 50 Push-ups Today" },
  { id: 2, intervals: 4, repetitions: 40, exercise: "Squats", description: "Do 40 Bodyweight Squats" },
  { id: 3, intervals: 3, repetitions: 30, exercise: "Lunges", description: "Complete 30 Lunges (15 per leg)" },
  { id: 4, intervals: 4, repetitions: 60, exercise: "Jumping Jacks", description: "Finish 60 Jumping Jacks" },
  { id: 5, intervals: 2, repetitions: 20, exercise: "Burpees", description: "Challenge Yourself with 20 Burpees" },
  { id: 6, intervals: 3, repetitions: 45, exercise: "Mountain Climbers", description: "Do 45 Mountain Climbers" },
  { id: 7, intervals: 5, repetitions: 25, exercise: "Plank (seconds)", description: "Hold Plank for 25 Seconds" },
  { id: 8, intervals: 3, repetitions: 15, exercise: "Pull-ups", description: "Do 15 Pull-ups" },
  { id: 9, intervals: 4, repetitions: 40, exercise: "High Knees", description: "Perform 40 High Knees" },
  { id: 10, intervals: 3, repetitions: 30, exercise: "Sit-ups", description: "Complete 30 Sit-ups" },
  { id: 11, intervals: 4, repetitions: 35, exercise: "Crunches", description: "Do 35 Crunches" },
  { id: 12, intervals: 2, repetitions: 25, exercise: "Jump Squats", description: "Complete 25 Jump Squats" },
  { id: 13, intervals: 3, repetitions: 10, exercise: "Handstand Push-ups", description: "Try 10 Handstand Push-ups" },
  { id: 14, intervals: 5, repetitions: 60, exercise: "Flutter Kicks", description: "Perform 60 Flutter Kicks" },
  { id: 15, intervals: 4, repetitions: 50, exercise: "Bicycle Crunches", description: "Do 50 Bicycle Crunches" },
  { id: 16, intervals: 3, repetitions: 20, exercise: "Box Jumps", description: "Complete 20 Box Jumps" },
  { id: 17, intervals: 2, repetitions: 30, exercise: "Tricep Dips", description: "Finish 30 Tricep Dips" },
  { id: 18, intervals: 4, repetitions: 40, exercise: "Wall Sits (seconds)", description: "Hold Wall Sit for 40 Seconds" },
  { id: 19, intervals: 3, repetitions: 50, exercise: "Step-ups", description: "Do 50 Step-ups" },
  { id: 20, intervals: 5, repetitions: 60, exercise: "Skaters", description: "Perform 60 Skaters" }
]

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
  console.log({todayChallenge})
  return todayChallenge;
}

// Example usage
console.log("Current Challenge:", getCurrentChallenge());
