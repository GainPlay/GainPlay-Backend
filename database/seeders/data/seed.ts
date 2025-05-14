// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data
  console.log("Clearing existing data...");
  await prisma.exercise_sets.deleteMany({});
  await prisma.workout_exercises.deleteMany({});
  await prisma.workouts.deleteMany({});
  await prisma.exercise_templates.deleteMany({});
  await prisma.exercises.deleteMany({});
  await prisma.user_goals.deleteMany({});
  await prisma.goals.deleteMany({});
  await prisma.user_badges.deleteMany({});
  await prisma.badges.deleteMany({});
  await prisma.user_avatars.deleteMany({});
  await prisma.avatars.deleteMany({});
  await prisma.user_settings.deleteMany({});
  await prisma.friendships.deleteMany({});
  await prisma.users.deleteMany({});

  // Insert avatars
  console.log("Adding avatars...");
  await prisma.avatars.createMany({
    data: [
      {
        price: 0,
        name: "Basic",
        image_url: "https://example.com/avatars/basic.png",
      },
      {
        price: 100,
        name: "Runner",
        image_url: "https://example.com/avatars/runner.png",
      },
      {
        price: 200,
        name: "Powerlifter",
        image_url: "https://example.com/avatars/powerlifter.png",
      },
      {
        price: 300,
        name: "Yoga Master",
        image_url: "https://example.com/avatars/yoga.png",
      },
      {
        price: 500,
        name: "Champion",
        image_url: "https://example.com/avatars/champion.png",
      },
      {
        price: 750,
        name: "Ninja",
        image_url: "https://example.com/avatars/ninja.png",
      },
      {
        price: 1000,
        name: "Superhero",
        image_url: "https://example.com/avatars/superhero.png",
      },
    ],
  });

  // Insert badges
  console.log("Adding badges...");
  await prisma.badges.createMany({
    data: [
      {
        icon: "trophy",
        name: "First Workout",
        description: "Complete your first workout",
      },
      {
        icon: "calendar-check",
        name: "Consistency King",
        description: "Complete 10 workouts in a month",
      },
      {
        icon: "dumbbell",
        name: "Strength Master",
        description: "Lift 5000 kg total in a single workout",
      },
      {
        icon: "sunrise",
        name: "Early Bird",
        description: "Complete 5 workouts before 8am",
      },
      {
        icon: "moon",
        name: "Night Owl",
        description: "Complete 5 workouts after 8pm",
      },
      { icon: "users", name: "Social Butterfly", description: "Add 5 friends" },
      {
        icon: "target",
        name: "Goal Crusher",
        description: "Complete all your fitness goals",
      },
    ],
  });

  // Insert users
  console.log("Adding users...");
  await prisma.users.createMany({
    data: [
      {
        level: 3,
        coins: 750,
        name: "John Doe",
        experience: 2500,
        email: "john@example.com",
        avatar_url: "https://example.com/avatars/john.png",
        password_hash: "$2a$10$7JfKzVJ5A4KD9.uB9HtfYehZB7TF3kYvQMW5A8PF",
      },
      {
        level: 5,
        coins: 1200,
        experience: 6700,
        name: "Jane Smith",
        email: "jane@example.com",
        avatar_url: "https://example.com/avatars/jane.png",
        password_hash: "$2a$10$2QjK6XJ1A4KD9.uB9HtfEeBZB7TF3kYvQMW5A8PF",
      },
      {
        level: 2,
        coins: 500,
        experience: 1500,
        name: "Mike Johnson",
        email: "mike@example.com",
        avatar_url: "https://example.com/avatars/mike.png",
        password_hash: "$2a$10$3RnKzVJ5A4KD9.uB9HtfYehZB7TF3kYvQMW5A8PF",
      },
      {
        level: 7,
        coins: 1800,
        experience: 12000,
        name: "Sarah Williams",
        email: "sarah@example.com",
        avatar_url: "https://example.com/avatars/sarah.png",
        password_hash: "$2a$10$9JfKzVJ5A4KD9.uB9HtfYehZB7TF3kYvQMW5A8PF",
      },
      {
        level: 1,
        coins: 350,
        experience: 800,
        name: "David Brown",
        email: "david@example.com",
        avatar_url: "https://example.com/avatars/david.png",
        password_hash: "$2a$10$7JgHzVJ5A4KD9.uB9HtfYehZB7TF3kYvQMW5A8PF",
      },
    ],
  });

  // Insert friendships
  // need npx prisma migrate reset before cause users ids is auto incremnt
  console.log("Adding friendships...");
  await prisma.friendships.createMany({
    data: [
      { user_id: 1, friend_id: 2, status: "accepted" },
      { user_id: 1, friend_id: 3, status: "accepted" },
      { user_id: 2, friend_id: 4, status: "accepted" },
      { user_id: 1, friend_id: 4, status: "pending" },
      { user_id: 3, friend_id: 5, status: "pending" },
      { user_id: 2, friend_id: 5, status: "accepted" },
    ],
    skipDuplicates: true,
  });

  // Insert user_settings
  console.log("Adding user settings...");
  await prisma.user_settings.createMany({
    data: [
      { user_id: 1, fitness_level: 2, exercise_frequency: 3 },
      { user_id: 2, fitness_level: 4, exercise_frequency: 5 },
      { user_id: 3, fitness_level: 1, exercise_frequency: 2 },
      { user_id: 4, fitness_level: 3, exercise_frequency: 4 },
      { user_id: 5, fitness_level: 1, exercise_frequency: 1 },
    ],
  });

  // Insert user_avatars
  console.log("Adding user avatars...");
  await prisma.user_avatars.createMany({
    data: [
      { user_id: 1, avatar_id: 1, is_current: false },
      { user_id: 1, avatar_id: 2, is_current: true },
      { user_id: 2, avatar_id: 1, is_current: false },
      { user_id: 2, avatar_id: 3, is_current: true },
      { user_id: 3, avatar_id: 1, is_current: true },
      { user_id: 4, avatar_id: 1, is_current: false },
      { user_id: 4, avatar_id: 5, is_current: true },
      { user_id: 5, avatar_id: 1, is_current: true },
    ],
  });

  // Insert user_badges
  console.log("Adding user badges...");
  await prisma.user_badges.createMany({
    data: [
      { user_id: 1, badge_id: 1 },
      { user_id: 1, badge_id: 3 },
      { user_id: 2, badge_id: 1 },
      { user_id: 2, badge_id: 2 },
      { user_id: 2, badge_id: 4 },
      { user_id: 3, badge_id: 1 },
      { user_id: 4, badge_id: 1 },
      { user_id: 4, badge_id: 2 },
      { user_id: 4, badge_id: 3 },
      { user_id: 4, badge_id: 6 },
      { user_id: 5, badge_id: 1 },
    ],
  });

  // Insert goals
  console.log("Adding goals...");
  await prisma.goals.createMany({
    data: [
      { name: "Weight Loss", description: "Lose specified amount of weight" },
      {
        name: "Strength Gain",
        description: "Increase weight lifted for specific exercises",
      },
      {
        name: "Workout Frequency",
        description: "Complete specified number of workouts per week",
      },
      {
        name: "Running Distance",
        description: "Run a specified total distance",
      },
      {
        name: "Consistency",
        description: "Work out consistently for a specified number of days",
      },
    ],
  });

  // Insert user_goals
  console.log("Adding user goals...");
  await prisma.user_goals.createMany({
    data: [
      { value: 10, user_id: 1, goal_id: 1 },
      { value: 3, user_id: 1, goal_id: 3 },
      { user_id: 2, goal_id: 2, value: 100 },
      { value: 5, user_id: 2, goal_id: 3 },
      { value: 30, user_id: 2, goal_id: 5 },
      { value: 15, user_id: 3, goal_id: 1 },
      { user_id: 4, goal_id: 2, value: 150 },
      { value: 4, user_id: 4, goal_id: 3 },
      { value: 50, user_id: 4, goal_id: 4 },
      { value: 5, user_id: 5, goal_id: 1 },
    ],
  });

  // Insert exercises
  console.log("Adding exercises...");
  await prisma.exercises.createMany({
    data: [
      {
        name: "Push Up",
        difficulty_level: 2,
        muscle_group: "Chest",
        category: "Bodyweight",
        description: "Standard push-up exercise",
      },
      {
        name: "Pull Up",
        difficulty_level: 3,
        muscle_group: "Back",
        category: "Bodyweight",
        description: "Upper body compound pulling exercise",
      },
      {
        name: "Squat",
        difficulty_level: 2,
        muscle_group: "Legs",
        category: "Bodyweight",
        description: "Lower body compound exercise",
      },
      {
        name: "Bench Press",
        difficulty_level: 3,
        category: "Strength",
        muscle_group: "Chest",
        description: "Upper body pressing exercise with barbell",
      },
      {
        name: "Deadlift",
        difficulty_level: 4,
        category: "Strength",
        muscle_group: "Back",
        description: "Full body pulling exercise with barbell",
      },
      {
        name: "Bicep Curl",
        difficulty_level: 2,
        category: "Strength",
        muscle_group: "Arms",
        description: "Isolation exercise for biceps",
      },
      {
        name: "Plank",
        difficulty_level: 2,
        muscle_group: "Core",
        category: "Bodyweight",
        description: "Core stabilizing exercise",
      },
      {
        name: "Running",
        category: "Cardio",
        difficulty_level: 2,
        muscle_group: "Full Body",
        description: "Cardiovascular exercise",
      },
      {
        name: "Lunges",
        difficulty_level: 2,
        muscle_group: "Legs",
        category: "Bodyweight",
        description: "Unilateral lower body exercise",
      },
      {
        difficulty_level: 3,
        category: "Strength",
        name: "Shoulder Press",
        muscle_group: "Shoulders",
        description: "Upper body pressing exercise with dumbbells",
      },
    ],
  });

  // Insert exercise_templates
  console.log("Adding exercise templates...");
  await prisma.exercise_templates.createMany({
    data: [
      {
        exercise_id: 1,
        target_sets: 3,
        target_reps: 12,
        rest_time_seconds: 60,
      },
      { exercise_id: 1, target_sets: 5, target_reps: 8, rest_time_seconds: 45 },
      { exercise_id: 2, target_sets: 3, target_reps: 8, rest_time_seconds: 90 },
      {
        exercise_id: 3,
        target_sets: 4,
        target_reps: 15,
        rest_time_seconds: 60,
      },
      {
        exercise_id: 4,
        target_sets: 5,
        target_reps: 5,
        rest_time_seconds: 120,
      },
      {
        exercise_id: 5,
        target_sets: 3,
        target_reps: 5,
        rest_time_seconds: 180,
      },
      {
        exercise_id: 6,
        target_sets: 3,
        target_reps: 12,
        rest_time_seconds: 60,
      },
      {
        exercise_id: 7,
        target_sets: 3,
        target_reps: 30,
        rest_time_seconds: 45,
      },
      { exercise_id: 8, target_sets: 1, target_reps: 1, rest_time_seconds: 0 },
      {
        exercise_id: 9,
        target_sets: 3,
        target_reps: 10,
        rest_time_seconds: 60,
      },
      {
        target_sets: 4,
        target_reps: 8,
        exercise_id: 10,
        rest_time_seconds: 90,
      },
    ],
  });

  // Insert workouts
  console.log("Adding workouts...");
  await prisma.workouts.createMany({
    data: [
      {
        user_id: 1,
        coins_earned: 50,
        started_at: new Date("2025-04-20 08:30:00"),
        completed_at: new Date("2025-04-20 09:15:00"),
      },
      {
        user_id: 1,
        coins_earned: 45,
        started_at: new Date("2025-04-22 07:45:00"),
        completed_at: new Date("2025-04-22 08:30:00"),
      },
      {
        user_id: 1,
        completed_at: null,
        coins_earned: null,
        started_at: new Date("2025-04-25 18:00:00"),
      },
      {
        user_id: 2,
        coins_earned: 75,
        started_at: new Date("2025-04-15 19:00:00"),
        completed_at: new Date("2025-04-15 20:30:00"),
      },
      {
        user_id: 2,
        coins_earned: 60,
        started_at: new Date("2025-04-18 18:30:00"),
        completed_at: new Date("2025-04-18 19:45:00"),
      },
      {
        user_id: 2,
        coins_earned: 80,
        started_at: new Date("2025-04-21 06:00:00"),
        completed_at: new Date("2025-04-21 07:15:00"),
      },
      {
        user_id: 2,
        coins_earned: 70,
        started_at: new Date("2025-04-24 17:30:00"),
        completed_at: new Date("2025-04-24 19:00:00"),
      },
      {
        user_id: 3,
        coins_earned: 30,
        started_at: new Date("2025-04-19 12:00:00"),
        completed_at: new Date("2025-04-19 12:45:00"),
      },
      {
        user_id: 4,
        coins_earned: 55,
        started_at: new Date("2025-04-16 05:30:00"),
        completed_at: new Date("2025-04-16 06:30:00"),
      },
      {
        user_id: 4,
        coins_earned: 60,
        started_at: new Date("2025-04-19 06:00:00"),
        completed_at: new Date("2025-04-19 07:00:00"),
      },
      {
        user_id: 4,
        coins_earned: 65,
        started_at: new Date("2025-04-22 05:45:00"),
        completed_at: new Date("2025-04-22 06:45:00"),
      },
      {
        user_id: 4,
        completed_at: null,
        coins_earned: null,
        started_at: new Date("2025-04-25 06:00:00"),
      },
      {
        user_id: 5,
        coins_earned: 25,
        started_at: new Date("2025-04-23 20:00:00"),
        completed_at: new Date("2025-04-23 20:30:00"),
      },
    ],
  });

  // Insert workout_exercises
  console.log("Adding workout exercises...");
  await prisma.workout_exercises.createMany({
    data: [
      // John's first workout
      { workout_id: 1, exercise_id: 1, template_id: 1, total_reps: 36 },
      { workout_id: 1, exercise_id: 3, template_id: 4, total_reps: 60 },
      { workout_id: 1, exercise_id: 7, template_id: 8, total_reps: 90 },
      // John's second workout
      { workout_id: 2, total_reps: 1, exercise_id: 8, template_id: 9 },
      { workout_id: 2, exercise_id: 9, total_reps: 30, template_id: 10 },
      // John's in-progress workout
      { workout_id: 3, total_reps: 0, exercise_id: 4, template_id: 5 },
      { workout_id: 3, total_reps: 0, exercise_id: 6, template_id: 7 },
      // Jane's workouts
      { workout_id: 4, exercise_id: 4, template_id: 5, total_reps: 25 },
      { workout_id: 4, exercise_id: 5, template_id: 6, total_reps: 15 },
      { workout_id: 4, total_reps: 32, exercise_id: 10, template_id: 11 },
      { workout_id: 5, exercise_id: 1, template_id: 2, total_reps: 40 },
      { workout_id: 5, exercise_id: 2, template_id: 3, total_reps: 24 },
      { workout_id: 5, exercise_id: 7, template_id: 8, total_reps: 90 },
      { workout_id: 6, total_reps: 1, exercise_id: 8, template_id: 9 },
      { workout_id: 6, exercise_id: 3, template_id: 4, total_reps: 60 },
      { workout_id: 6, exercise_id: 9, total_reps: 30, template_id: 10 },
      { workout_id: 7, exercise_id: 4, template_id: 5, total_reps: 25 },
      { workout_id: 7, exercise_id: 6, template_id: 7, total_reps: 36 },
      { workout_id: 7, total_reps: 32, exercise_id: 10, template_id: 11 },
      // Mike's workout
      { workout_id: 8, exercise_id: 1, template_id: 1, total_reps: 36 },
      { workout_id: 8, exercise_id: 7, template_id: 8, total_reps: 90 },
      // Sarah's workouts
      { workout_id: 9, total_reps: 1, exercise_id: 8, template_id: 9 },
      { workout_id: 9, exercise_id: 3, template_id: 4, total_reps: 60 },
      { workout_id: 10, exercise_id: 1, template_id: 1, total_reps: 36 },
      { workout_id: 10, exercise_id: 7, template_id: 8, total_reps: 90 },
      { workout_id: 11, exercise_id: 4, template_id: 5, total_reps: 25 },
      { workout_id: 11, exercise_id: 6, template_id: 7, total_reps: 36 },
      // Sarah's in-progress workout
      { total_reps: 0, workout_id: 12, exercise_id: 8, template_id: 9 },
      { total_reps: 0, workout_id: 12, exercise_id: 9, template_id: 10 },
      // David's workout
      { workout_id: 13, exercise_id: 1, template_id: 1, total_reps: 36 },
    ],
  });

  // Insert exercise_sets
  console.log("Adding exercise sets...");
  await prisma.exercise_sets.createMany({
    data: [
      // John's first workout
      {
        reps: 12,
        set_number: 1,
        completed: true,
        workout_exercise_id: 1,
        completed_at: new Date("2025-04-20 08:35:00"),
      },
      {
        reps: 12,
        set_number: 2,
        completed: true,
        workout_exercise_id: 1,
        completed_at: new Date("2025-04-20 08:40:00"),
      },
      {
        reps: 12,
        set_number: 3,
        completed: true,
        workout_exercise_id: 1,
        completed_at: new Date("2025-04-20 08:45:00"),
      },
      {
        reps: 15,
        set_number: 1,
        completed: true,
        workout_exercise_id: 2,
        completed_at: new Date("2025-04-20 08:50:00"),
      },
      {
        reps: 15,
        set_number: 2,
        completed: true,
        workout_exercise_id: 2,
        completed_at: new Date("2025-04-20 08:55:00"),
      },
      {
        reps: 15,
        set_number: 3,
        completed: true,
        workout_exercise_id: 2,
        completed_at: new Date("2025-04-20 09:00:00"),
      },
      {
        reps: 15,
        set_number: 4,
        completed: true,
        workout_exercise_id: 2,
        completed_at: new Date("2025-04-20 09:05:00"),
      },
      {
        reps: 30,
        set_number: 1,
        completed: true,
        workout_exercise_id: 3,
        completed_at: new Date("2025-04-20 09:10:00"),
      },
      {
        reps: 30,
        set_number: 2,
        completed: true,
        workout_exercise_id: 3,
        completed_at: new Date("2025-04-20 09:12:00"),
      },
      {
        reps: 30,
        set_number: 3,
        completed: true,
        workout_exercise_id: 3,
        completed_at: new Date("2025-04-20 09:15:00"),
      },

      // John's second workout
      {
        reps: 1,
        set_number: 1,
        completed: true,
        workout_exercise_id: 4,
        completed_at: new Date("2025-04-22 08:15:00"),
      },
      {
        reps: 10,
        set_number: 1,
        completed: true,
        workout_exercise_id: 5,
        completed_at: new Date("2025-04-22 08:20:00"),
      },
      {
        reps: 10,
        set_number: 2,
        completed: true,
        workout_exercise_id: 5,
        completed_at: new Date("2025-04-22 08:25:00"),
      },
      {
        reps: 10,
        set_number: 3,
        completed: true,
        workout_exercise_id: 5,
        completed_at: new Date("2025-04-22 08:30:00"),
      },

      // John's in-progress workout
      {
        reps: 0,
        set_number: 1,
        completed: false,
        completed_at: null,
        workout_exercise_id: 6,
      },
      {
        reps: 0,
        set_number: 2,
        completed: false,
        completed_at: null,
        workout_exercise_id: 6,
      },
      {
        reps: 0,
        set_number: 3,
        completed: false,
        completed_at: null,
        workout_exercise_id: 6,
      },
      {
        reps: 0,
        set_number: 4,
        completed: false,
        completed_at: null,
        workout_exercise_id: 6,
      },
      {
        reps: 0,
        set_number: 5,
        completed: false,
        completed_at: null,
        workout_exercise_id: 6,
      },
      {
        reps: 0,
        set_number: 1,
        completed: false,
        completed_at: null,
        workout_exercise_id: 7,
      },
      {
        reps: 0,
        set_number: 2,
        completed: false,
        completed_at: null,
        workout_exercise_id: 7,
      },
      {
        reps: 0,
        set_number: 3,
        completed: false,
        completed_at: null,
        workout_exercise_id: 7,
      },

      // Sample sets for other completed workouts (abbreviated for brevity)
      // Jane's first workout (partial)
      {
        reps: 5,
        set_number: 1,
        completed: true,
        workout_exercise_id: 8,
        completed_at: new Date("2025-04-15 19:15:00"),
      },
      {
        reps: 5,
        set_number: 2,
        completed: true,
        workout_exercise_id: 8,
        completed_at: new Date("2025-04-15 19:20:00"),
      },
      {
        reps: 5,
        set_number: 3,
        completed: true,
        workout_exercise_id: 8,
        completed_at: new Date("2025-04-15 19:25:00"),
      },
      {
        reps: 5,
        set_number: 4,
        completed: true,
        workout_exercise_id: 8,
        completed_at: new Date("2025-04-15 19:30:00"),
      },
      {
        reps: 5,
        set_number: 5,
        completed: true,
        workout_exercise_id: 8,
        completed_at: new Date("2025-04-15 19:35:00"),
      },
      {
        reps: 5,
        set_number: 1,
        completed: true,
        workout_exercise_id: 9,
        completed_at: new Date("2025-04-15 19:45:00"),
      },
      {
        reps: 5,
        set_number: 2,
        completed: true,
        workout_exercise_id: 9,
        completed_at: new Date("2025-04-15 19:50:00"),
      },
      {
        reps: 5,
        set_number: 3,
        completed: true,
        workout_exercise_id: 9,
        completed_at: new Date("2025-04-15 19:55:00"),
      },

      // Mike's workout (partial)
      {
        reps: 12,
        set_number: 1,
        completed: true,
        workout_exercise_id: 18,
        completed_at: new Date("2025-04-19 12:15:00"),
      },
      {
        reps: 12,
        set_number: 2,
        completed: true,
        workout_exercise_id: 18,
        completed_at: new Date("2025-04-19 12:20:00"),
      },
      {
        reps: 12,
        set_number: 3,
        completed: true,
        workout_exercise_id: 18,
        completed_at: new Date("2025-04-19 12:25:00"),
      },

      // David's workout
      {
        reps: 12,
        set_number: 1,
        completed: true,
        workout_exercise_id: 27,
        completed_at: new Date("2025-04-23 20:10:00"),
      },
      {
        reps: 12,
        set_number: 2,
        completed: true,
        workout_exercise_id: 27,
        completed_at: new Date("2025-04-23 20:20:00"),
      },
      {
        reps: 12,
        set_number: 3,
        completed: true,
        workout_exercise_id: 27,
        completed_at: new Date("2025-04-23 20:30:00"),
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error("Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
