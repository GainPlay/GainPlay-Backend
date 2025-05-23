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
        streak: 0,
        coins: 750,
        name: "John Doe",
        experience: 2500,
        password_hash: "123",
        email: "john@example.com",
        avatar_url: "https://example.com/avatars/john.png",
      },
      {
        level: 5,
        streak: 2,
        coins: 1200,
        experience: 6700,
        name: "Jane Smith",
        email: "jane@example.com",
        avatar_url: "https://example.com/avatars/jane.png",
        password_hash: "$2a$10$2QjK6XJ1A4KD9.uB9HtfEeBZB7TF3kYvQMW5A8PF",
      },
      {
        level: 2,
        streak: 5,
        coins: 500,
        experience: 1500,
        name: "Mike Johnson",
        email: "mike@example.com",
        avatar_url: "https://example.com/avatars/mike.png",
        password_hash: "$2a$10$3RnKzVJ5A4KD9.uB9HtfYehZB7TF3kYvQMW5A8PF",
      },
      {
        level: 7,
        streak: 9,
        coins: 1800,
        experience: 12000,
        name: "Sarah Williams",
        email: "sarah@example.com",
        avatar_url: "https://example.com/avatars/sarah.png",
        password_hash: "$2a$10$9JfKzVJ5A4KD9.uB9HtfYehZB7TF3kYvQMW5A8PF",
      },
      {
        level: 1,
        streak: 0,
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
    skipDuplicates: true,
    data: [
      { user_id: 1, friend_id: 2, status: "accepted" },
      { user_id: 1, friend_id: 3, status: "accepted" },
      { user_id: 2, friend_id: 4, status: "accepted" },
      { user_id: 1, friend_id: 4, status: "pending" },
      { user_id: 3, friend_id: 5, status: "pending" },
      { user_id: 2, friend_id: 5, status: "accepted" },
    ],
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
        score: 80,
        user_id: 1,
        coins_earned: 50,
        experience_earned: 150,
        started_at: new Date("2025-04-20 08:30:00"),
        completed_at: new Date("2025-04-20 09:15:00"),
      },
      {
        score: 75,
        user_id: 1,
        coins_earned: 45,
        experience_earned: 120,
        started_at: new Date("2025-04-22 07:45:00"),
        completed_at: new Date("2025-04-22 08:30:00"),
      },
      {
        user_id: 1,
        score: null,
        completed_at: null,
        coins_earned: null,
        experience_earned: null,
        started_at: new Date("2025-04-25 18:00:00"),
      },
      {
        score: 90,
        user_id: 2,
        coins_earned: 75,
        experience_earned: 200,
        started_at: new Date("2025-04-15 19:00:00"),
        completed_at: new Date("2025-04-15 20:30:00"),
      },
      {
        score: 85,
        user_id: 2,
        coins_earned: 60,
        experience_earned: 170,
        started_at: new Date("2025-04-18 18:30:00"),
        completed_at: new Date("2025-04-18 19:45:00"),
      },
      {
        score: 92,
        user_id: 2,
        coins_earned: 80,
        experience_earned: 210,
        started_at: new Date("2025-04-21 06:00:00"),
        completed_at: new Date("2025-04-21 07:15:00"),
      },
      {
        score: 88,
        user_id: 2,
        coins_earned: 70,
        experience_earned: 185,
        started_at: new Date("2025-04-24 17:30:00"),
        completed_at: new Date("2025-04-24 19:00:00"),
      },
      {
        score: 60,
        user_id: 3,
        coins_earned: 30,
        experience_earned: 80,
        started_at: new Date("2025-04-19 12:00:00"),
        completed_at: new Date("2025-04-19 12:45:00"),
      },
      {
        score: 82,
        user_id: 4,
        coins_earned: 55,
        experience_earned: 160,
        started_at: new Date("2025-04-16 05:30:00"),
        completed_at: new Date("2025-04-16 06:30:00"),
      },
      {
        score: 85,
        user_id: 4,
        coins_earned: 60,
        experience_earned: 170,
        started_at: new Date("2025-04-19 06:00:00"),
        completed_at: new Date("2025-04-19 07:00:00"),
      },
      {
        score: 87,
        user_id: 4,
        coins_earned: 65,
        experience_earned: 180,
        started_at: new Date("2025-04-22 05:45:00"),
        completed_at: new Date("2025-04-22 06:45:00"),
      },
      {
        user_id: 4,
        score: null,
        completed_at: null,
        coins_earned: null,
        experience_earned: null,
        started_at: new Date("2025-04-25 06:00:00"),
      },
      {
        score: 50,
        user_id: 5,
        coins_earned: 25,
        experience_earned: 60,
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
      { workout_id: 1, exercise_id: 1, template_id: 1 },
      { workout_id: 1, exercise_id: 3, template_id: 4 },
      { workout_id: 1, exercise_id: 7, template_id: 8 },
      // John's second workout
      { workout_id: 2, exercise_id: 8, template_id: 9 },
      { workout_id: 2, exercise_id: 9, template_id: 10 },
      // John's in-progress workout
      { workout_id: 3, exercise_id: 4, template_id: 5 },
      { workout_id: 3, exercise_id: 6, template_id: 7 },
      // Jane's workouts
      { workout_id: 4, exercise_id: 4, template_id: 5 },
      { workout_id: 4, exercise_id: 5, template_id: 6 },
      { workout_id: 4, exercise_id: 10, template_id: 11 },
      { workout_id: 5, exercise_id: 1, template_id: 2 },
      { workout_id: 5, exercise_id: 2, template_id: 3 },
      { workout_id: 5, exercise_id: 7, template_id: 8 },
      { workout_id: 6, exercise_id: 8 },
      { workout_id: 6, exercise_id: 3, template_id: 4 },
      { workout_id: 6, exercise_id: 9, template_id: 10 },
      { workout_id: 7, exercise_id: 4, template_id: 5 },
      { workout_id: 7, exercise_id: 6, template_id: 7 },
      { workout_id: 7, exercise_id: 10, template_id: 11 },
      // Mike's workout
      { workout_id: 8, exercise_id: 1, template_id: 1 },
      { workout_id: 8, exercise_id: 7, template_id: 8 },
      // Sarah's workouts
      { workout_id: 9, exercise_id: 8, template_id: 9 },
      { workout_id: 9, exercise_id: 3, template_id: 4 },
      { workout_id: 10, exercise_id: 1, template_id: 1 },
      { workout_id: 10, exercise_id: 7, template_id: 8 },
      { workout_id: 11, exercise_id: 4, template_id: 5 },
      { workout_id: 11, exercise_id: 6, template_id: 7 },
      // Sarah's in-progress workout
      { workout_id: 12, exercise_id: 8, template_id: 9 },
      { workout_id: 12, exercise_id: 9, template_id: 10 },
      // David's workout
      { workout_id: 13, exercise_id: 1, template_id: 1 },
    ],
  });

  // Insert exercise_sets
  console.log("Adding exercise sets...");
  await prisma.exercise_sets.createMany({
    data: [
      // John's first workout
      { reps: 12, set_number: 1, completed_reps: 0, workout_exercise_id: 1 },
      { reps: 12, set_number: 2, completed_reps: 0, workout_exercise_id: 1 },
      { reps: 12, set_number: 3, completed_reps: 0, workout_exercise_id: 1 },
      { reps: 15, set_number: 1, completed_reps: 0, workout_exercise_id: 2 },
      { reps: 15, set_number: 2, completed_reps: 0, workout_exercise_id: 2 },
      { reps: 15, set_number: 3, completed_reps: 0, workout_exercise_id: 2 },
      { reps: 15, set_number: 4, completed_reps: 0, workout_exercise_id: 2 },
      { reps: 30, set_number: 1, completed_reps: 0, workout_exercise_id: 3 },
      { reps: 30, set_number: 2, completed_reps: 0, workout_exercise_id: 3 },
      { reps: 30, set_number: 3, completed_reps: 0, workout_exercise_id: 3 },

      // John's second workout
      { reps: 1, set_number: 1, completed_reps: 0, workout_exercise_id: 4 },
      { reps: 10, set_number: 1, completed_reps: 0, workout_exercise_id: 5 },
      { reps: 10, set_number: 2, completed_reps: 0, workout_exercise_id: 5 },
      { reps: 10, set_number: 3, completed_reps: 0, workout_exercise_id: 5 },

      // John's in-progress workout
      { reps: 0, set_number: 1, completed_reps: 0, workout_exercise_id: 6 },
      { reps: 0, set_number: 2, completed_reps: 0, workout_exercise_id: 6 },
      { reps: 0, set_number: 3, completed_reps: 0, workout_exercise_id: 6 },
      { reps: 0, set_number: 4, completed_reps: 0, workout_exercise_id: 6 },
      { reps: 0, set_number: 5, completed_reps: 0, workout_exercise_id: 6 },
      { reps: 0, set_number: 1, completed_reps: 0, workout_exercise_id: 7 },
      { reps: 0, set_number: 2, completed_reps: 0, workout_exercise_id: 7 },
      { reps: 0, set_number: 3, completed_reps: 0, workout_exercise_id: 7 },

      // Jane's first workout (partial)
      { reps: 5, set_number: 1, completed_reps: 0, workout_exercise_id: 8 },
      { reps: 5, set_number: 2, completed_reps: 0, workout_exercise_id: 8 },
      { reps: 5, set_number: 3, completed_reps: 0, workout_exercise_id: 8 },
      { reps: 5, set_number: 4, completed_reps: 0, workout_exercise_id: 8 },
      { reps: 5, set_number: 5, completed_reps: 0, workout_exercise_id: 8 },
      { reps: 5, set_number: 1, completed_reps: 0, workout_exercise_id: 9 },
      { reps: 5, set_number: 2, completed_reps: 0, workout_exercise_id: 9 },
      { reps: 5, set_number: 3, completed_reps: 0, workout_exercise_id: 9 },

      // Mike's workout (partial)
      { reps: 12, set_number: 1, completed_reps: 0, workout_exercise_id: 18 },
      { reps: 12, set_number: 2, completed_reps: 0, workout_exercise_id: 18 },
      { reps: 12, set_number: 3, completed_reps: 0, workout_exercise_id: 18 },

      // David's workout
      { reps: 12, set_number: 1, completed_reps: 0, workout_exercise_id: 27 },
      { reps: 12, set_number: 2, completed_reps: 0, workout_exercise_id: 27 },
      { reps: 12, set_number: 3, completed_reps: 0, workout_exercise_id: 27 },
    ],
  });

  // Avatars
  const styles = [
    "adventurer",
    "adventurer-neutral",
    "avataaars",
    "big-ears",
    "big-ears-neutral",
    "bottts",
    "croodles",
    "fun-emoji",
    "lorelei",
    "micah",
    "miniavs",
    "personas",
    "pixel-art",
  ];

  // Free avatars (given to all users) - Common rarity
  const freeAvatars = [
    {
      price: 0,
      rarity: "common",
      name: "Default Avatar",
      image_url: "https://api.dicebear.com/6.x/avataaars/svg?seed=default",
    },
    {
      price: 0,
      rarity: "common",
      name: "Starter Hero",
      image_url: "https://api.dicebear.com/6.x/adventurer/svg?seed=gainplay1",
    },
    {
      price: 0,
      rarity: "common",
      name: "Fitness Buddy",
      image_url: "https://api.dicebear.com/6.x/big-ears/svg?seed=fitness",
    },
  ];

  // Purchasable avatars with different rarities
  const purchasableAvatars = [];

  // Generate 3 avatars for each style with different rarities
  styles.forEach((style, styleIndex) => {
    for (let i = 1; i <= 3; i++) {
      const seed = `gainplay-${style}-${i}`;

      // Determine rarity and price based on avatar number and style
      let rarity = "common";
      let basePrice = 100;

      if (i === 1) {
        rarity = "common";
        basePrice = 100;
      } else if (i === 2) {
        rarity = "rare";
        basePrice = 200;
      } else if (i === 3) {
        rarity = "epic";
        basePrice = 350;
      }

      purchasableAvatars.push({
        rarity: rarity,
        price: basePrice + styleIndex * 20, // Style variation in price
        name: `${style.charAt(0).toUpperCase() + style.slice(1)} ${i}`,
        image_url: `https://api.dicebear.com/6.x/${style}/svg?seed=${seed}`,
      });
    }
  });

  // Premium special avatars - Legendary rarity
  const premiumAvatars = [
    {
      price: 500,
      rarity: "legendary",
      name: "Fitness Pro",
      image_url:
        "https://api.dicebear.com/6.x/avataaars/svg?seed=fitnesspro&clothesColor=3c4f5c&clothes=overall&hairColor=2c1b18&facialHairColor=2c1b18&facialHair=beardMajestic&eyes=surprised&eyebrows=raisedExcited",
    },
    {
      price: 550,
      name: "Gym Master",
      rarity: "legendary",
      image_url:
        "https://api.dicebear.com/6.x/avataaars/svg?seed=gymmaster&clothesColor=ff0000&clothes=hoodie&top=shortCurly&hairColor=000000&facialHairColor=000000&facialHair=beardLight&eyes=default&eyebrows=default",
    },
    {
      price: 600,
      rarity: "legendary",
      name: "Cardio King",
      image_url:
        "https://api.dicebear.com/6.x/avataaars/svg?seed=cardioking&clothesColor=0000ff&clothes=shirtScoopNeck&top=shortWaved&hairColor=a52a2a&facialHairColor=a52a2a&eyes=happy&eyebrows=default",
    },
    {
      price: 650,
      name: "Yoga Guru",
      rarity: "legendary",
      image_url:
        "https://api.dicebear.com/6.x/avataaars/svg?seed=yogaguru&clothesColor=ffc0cb&clothes=graphicShirt&top=longHair&hairColor=ffd700&facialHairColor=ffd700&eyes=hearts&eyebrows=raised",
    },
  ];

  // Combine all avatars
  const allAvatars = [...freeAvatars, ...purchasableAvatars, ...premiumAvatars];

  // Insert avatars into database
  console.log(`Adding ${allAvatars.length} avatars to the database...`);

  for (const avatar of allAvatars) {
    // First check if avatar exists by name
    const existingAvatar = await prisma.avatars.findFirst({
      where: { name: avatar.name },
    });

    if (existingAvatar) {
      // Update existing avatar with new rarity field
      await prisma.avatars.update({
        data: avatar,
        where: { id: existingAvatar.id },
      });
      console.log(`Updated avatar: ${avatar.name} (${avatar.rarity})`);
    } else {
      // Create new avatar
      await prisma.avatars.create({
        data: avatar,
      });
      console.log(`Created avatar: ${avatar.name} (${avatar.rarity})`);
    }
  }

  console.log("Avatars added successfully with rarity levels!");

  // Log summary by rarity
  const rarityCounts = allAvatars.reduce((acc, avatar) => {
    acc[avatar.rarity] = (acc[avatar.rarity] || 0) + 1;
    return acc;
  }, {});

  console.log("Avatar distribution by rarity:");
  Object.entries(rarityCounts).forEach(([rarity, count]) => {
    console.log(`- ${rarity}: ${count} avatars`);
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
