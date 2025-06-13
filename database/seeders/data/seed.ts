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
  const badges = [
    // Easy to achieve (1-3 workouts)
    {
      icon: "👟",
      name: "First Steps",
      description: "Complete your first workout",
    },
    {
      icon: "🚀",
      name: "Getting Started",
      description: "Complete 3 workouts",
    },
    {
      icon: "🌅",
      name: "Early Bird",
      description: "Complete a workout before 9 AM",
    },
    {
      icon: "🦉",
      name: "Night Owl",
      description: "Complete a workout after 8 PM",
    },

    // Rep-based (easy to achieve)
    {
      icon: "🔢",
      name: "Rep Rookie",
      description: "Complete 100 total reps",
    },
    {
      icon: "⚔️",
      name: "Rep Warrior",
      description: "Complete 500 total reps",
    },
    {
      icon: "✨",
      name: "Perfect Form",
      description: "Complete a workout with 100% accuracy",
    },

    // Streak-based (short streaks)
    {
      icon: "🔥",
      name: "On Fire",
      description: "Maintain a 3-day workout streak",
    },
    {
      icon: "👑",
      name: "Consistency King",
      description: "Maintain a 7-day workout streak",
    },

    // Exercise variety
    {
      icon: "🗺️",
      name: "Explorer",
      description: "Try 5 different exercises",
    },
    {
      icon: "🧭",
      name: "Adventurer",
      description: "Try 10 different exercises",
    },

    // Intensity-based
    {
      icon: "🌡️",
      name: "Warm Up",
      description: "Complete an easy workout (difficulty 1-2)",
    },
    {
      icon: "💪",
      name: "Feeling Strong",
      description: "Complete a medium workout (difficulty 3)",
    },
    {
      icon: "🦾",
      name: "Beast Mode",
      description: "Complete a hard workout (difficulty 4-5)",
    },

    // Coin-based
    {
      icon: "💸",
      name: "Coin Collector",
      description: "Earn 50 coins total",
    },
    {
      icon: "💰",
      name: "Treasure Hunter",
      description: "Earn 100 coins total",
    },

    // XP/Level-based
    {
      icon: "📈",
      name: "Level Up",
      description: "Reach level 2",
    },
    {
      icon: "⭐",
      name: "Rising Star",
      description: "Reach level 5",
    },

    // Time-based
    {
      icon: "⚡",
      name: "Quick Burn",
      description: "Complete a workout in under 15 minutes",
    },
    {
      icon: "🏃",
      name: "Marathon",
      description: "Complete a workout lasting 30+ minutes",
    },

    // Social/Fun
    {
      icon: "🎉",
      name: "Weekend Warrior",
      description: "Complete a workout on Saturday or Sunday",
    },
    {
      icon: "💯",
      name: "Monday Motivation",
      description: "Complete a workout on Monday",
    },

    // Muscle group specific
    {
      icon: "🏋️",
      name: "Upper Body Focus",
      description: "Complete 5 upper body exercises",
    },
    {
      icon: "🦵",
      name: "Leg Day Legend",
      description: "Complete 5 lower body exercises",
    },
    {
      icon: "🎯",
      name: "Core Crusher",
      description: "Complete 5 core exercises",
    },

    // Special achievements
    {
      icon: "🎮",
      name: "Welcome to GainPlay",
      description: "Create your account and complete onboarding",
    },
    {
      icon: "🎭",
      name: "Avatar Collector",
      description: "Purchase your first avatar",
    },
    {
      icon: "🦋",
      name: "Social Butterfly",
      description: "Add your first friend",
    },

    // Milestone badges
    {
      icon: "💯",
      name: "Century Club",
      description: "Complete 100 exercise sets total",
    },
    {
      icon: "🏆",
      name: "Dedicated",
      description: "Complete 10 workouts total",
    },
  ];

  for (const badge of badges) {
    // Find existing badge by name
    const existingBadge = await prisma.badges.findFirst({
      where: { name: badge.name },
    });

    if (existingBadge) {
      await prisma.badges.update({
        data: badge,
        where: { id: existingBadge.id },
      });
    } else {
      await prisma.badges.create({
        data: badge,
      });
    }
  }

  // Insert goals
  console.log("Adding goals...");
  await prisma.goals.createMany({
    data: [
      { name: "Lose Weight", description: "Lose specified amount of weight" },
      {
        name: "Gain Muscle",
        description: "Increase weight lifted for specific exercises",
      },
      {
        name: "Improve Endurance",
        description:
          "Build stamina and cardiovascular fitness to power through longer workouts and daily activities with ease",
      },
      {
        name: "Increase Strength",
        description:
          "Develop muscle power and functional strength to lift heavier, perform better, and feel stronger in everyday life",
      },
      {
        name: "Improve Flexibility",
        description:
          "Enhance your range of motion and mobility to move freely, prevent injuries, and improve overall body balance",
      },
      {
        name: "Maintain Health",
        description:
          "Stay active and consistent with regular exercise to support your overall well-being and long-term vitality",
      },
    ],
  });

  // Insert exercises
  console.log("Adding exercises...");
  await prisma.exercises.createMany({
    data: [
      {
        name: "Air Squat",
        difficulty_level: 2,
        muscle_group: "Legs",
        category: "Bodyweight",
        description: "Basic lower body squat exercise",
      },
      {
        difficulty_level: 2,
        muscle_group: "Abs",
        category: "Bodyweight",
        name: "Alternating Leg Raise",
        description: "Alternating lying leg raises for abs",
      },
      {
        name: "Bench Dip",
        difficulty_level: 2,
        muscle_group: "Arms",
        category: "Bodyweight",
        description: "Tricep dips using a bench",
      },
      {
        difficulty_level: 3,
        muscle_group: "Legs",
        category: "Bodyweight",
        name: "Bench Pistol Squat",
        description: "Single-leg squat using bench support",
      },
      {
        difficulty_level: 2,
        muscle_group: "Abs",
        category: "Bodyweight",
        name: "Bench Reverse Crunch",
        description: "Reverse crunch performed on a bench",
      },
      {
        difficulty_level: 2,
        muscle_group: "Arms",
        category: "Bodyweight",
        name: "Knees Bench Dip",
        description: "Bent-knee variation of bench dip",
      },
      {
        difficulty_level: 2,
        muscle_group: "Abs",
        name: "Bicycle Crunch",
        category: "Bodyweight",
        description: "Core-twisting bicycle crunch",
      },
      {
        name: "Bird Dog",
        difficulty_level: 2,
        muscle_group: "Core",
        category: "Bodyweight",
        description: "Balance and core stability exercise",
      },
      {
        difficulty_level: 3,
        category: "Bodyweight",
        name: "Boat Hold Flutters",
        muscle_group: "Abs and Core",
        description: "Boat hold with flutter kicks for abs",
      },
      {
        difficulty_level: 4,
        muscle_group: "Legs",
        category: "Bodyweight",
        name: "Bulgarian Split Jump",
        description: "Jumping Bulgarian split squat",
      },
      {
        difficulty_level: 3,
        muscle_group: "Legs",
        category: "Bodyweight",
        name: "Bulgarian Split Squat",
        description: "Split squat with rear foot elevated",
      },
      {
        name: "Butt Kicks",
        category: "Cardio",
        difficulty_level: 1,
        muscle_group: "Cardio",
        description: "Running in place with heels to glutes",
      },
      {
        name: "Chest Dip",
        difficulty_level: 3,
        muscle_group: "Chest",
        category: "Bodyweight",
        description: "Upper body dip focusing on chest",
      },
      {
        difficulty_level: 4,
        muscle_group: "Back",
        category: "Bodyweight",
        name: "Close Grip Pull-Up",
        description: "Pull-up with narrow grip",
      },
      {
        name: "Cocoons",
        difficulty_level: 2,
        muscle_group: "Abs",
        category: "Bodyweight",
        description: "Crunching core exercise",
      },
      {
        category: "Cardio",
        difficulty_level: 2,
        muscle_group: "Cardio",
        name: "Crab Toe Touches",
        description: "Dynamic crab position touches",
      },
      {
        name: "Dead Bug",
        difficulty_level: 2,
        category: "Bodyweight",
        muscle_group: "Abs and Core",
        description: "Core stability exercise",
      },
      {
        difficulty_level: 2,
        category: "Bodyweight",
        name: "Dead Bug Lowering",
        muscle_group: "Abs and Core",
        description: "Dead bug with leg lowering",
      },
      {
        difficulty_level: 3,
        muscle_group: "Chest",
        category: "Bodyweight",
        name: "Decline Push-Up",
        description: "Push-up with feet elevated",
      },
      {
        difficulty_level: 3,
        muscle_group: "Chest",
        category: "Bodyweight",
        name: "Decline Wide Push-Up",
        description: "Wide-arm push-up with decline",
      },
      {
        difficulty_level: 2,
        muscle_group: "Core",
        name: "Diagonal Plank",
        category: "Bodyweight",
        description: "Plank with diagonal hold",
      },
      {
        difficulty_level: 3,
        category: "Bodyweight",
        name: "Diamond Push-Up",
        muscle_group: "Chest and Triceps",
        description: "Push-up with diamond hand position",
      },
      {
        difficulty_level: 3,
        category: "Bodyweight",
        muscle_group: "Shoulders",
        name: "Elevated Pike Push-Up",
        description: "Shoulder-focused pike push-up",
      },
      {
        difficulty_level: 3,
        muscle_group: "Arms",
        category: "Bodyweight",
        name: "Elevated Bench Dip",
        description: "Dip with feet elevated on bench",
      },
      {
        name: "Floor Dip",
        difficulty_level: 2,
        muscle_group: "Arms",
        category: "Bodyweight",
        description: "Tricep dip from floor position",
      },
      {
        difficulty_level: 2,
        name: "Flutter Kicks",
        category: "Bodyweight",
        muscle_group: "Abs and Core",
        description: "Leg fluttering core exercise",
      },
      {
        difficulty_level: 2,
        muscle_group: "Legs",
        name: "Forward Lunges",
        category: "Bodyweight",
        description: "Alternating forward lunges",
      },
      {
        category: "Cardio",
        difficulty_level: 2,
        name: "High Knee Taps",
        muscle_group: "Cardio",
        description: "Running in place with high knees",
      },
      {
        category: "Cardio",
        difficulty_level: 1,
        name: "Jumping Jack",
        muscle_group: "Cardio",
        description: "Full body jumping jack",
      },
      {
        category: "Cardio",
        difficulty_level: 3,
        muscle_group: "Legs",
        name: "Jumping Lunges",
        description: "Explosive alternating lunges",
      },
      {
        name: "Locust",
        difficulty_level: 2,
        category: "Bodyweight",
        muscle_group: "Back and Core",
        description: "Prone back extension exercise",
      },
      {
        name: "Lunge Jump",
        category: "Cardio",
        difficulty_level: 3,
        muscle_group: "Legs",
        description: "Jumping between lunges",
      },
      {
        difficulty_level: 3,
        name: "Leg Raise Hold",
        category: "Bodyweight",
        muscle_group: "Abs and Core",
        description: "Static hold with raised legs",
      },
      {
        difficulty_level: 2,
        category: "Bodyweight",
        name: "Lying Leg Raise",
        muscle_group: "Abs and Core",
        description: "Supine leg raises for abs",
      },
      {
        difficulty_level: 2,
        category: "Bodyweight",
        name: "Mountain Climber",
        muscle_group: "Abs and Core",
        description: "Dynamic core cardio exercise",
      },
      {
        difficulty_level: 2,
        name: "Narrow Squat",
        muscle_group: "Legs",
        category: "Bodyweight",
        description: "Squat with narrow stance",
      },
      {
        difficulty_level: 3,
        muscle_group: "Legs",
        name: "Overhead Squat",
        category: "Bodyweight",
        description: "Squat with arms overhead",
      },
      {
        difficulty_level: 3,
        name: "Pike Push-Up",
        category: "Bodyweight",
        muscle_group: "Shoulders",
        description: "Inverted shoulder push-up",
      },
      {
        name: "Plank Jack",
        category: "Cardio",
        difficulty_level: 2,
        muscle_group: "Cardio",
        description: "Jumping jacks in plank position",
      },
      {
        category: "Cardio",
        name: "Plank Lunge",
        difficulty_level: 3,
        muscle_group: "Cardio",
        description: "Dynamic plank-to-lunge movement",
      },
      {
        difficulty_level: 4,
        muscle_group: "Back",
        category: "Bodyweight",
        name: "Regular Pull-Up",
        description: "Standard grip pull-up",
      },
      {
        name: "Push-Up",
        difficulty_level: 2,
        muscle_group: "Chest",
        category: "Bodyweight",
        description: "Standard push-up exercise",
      },
      {
        difficulty_level: 2,
        name: "Reverse Crunch",
        category: "Bodyweight",
        muscle_group: "Abs and Core",
        description: "Core-focused reverse crunch",
      },
      {
        category: "Cardio",
        difficulty_level: 3,
        muscle_group: "Cardio",
        name: "Reverse Lunge Jump",
        description: "Jumping reverse lunges",
      },
      {
        difficulty_level: 2,
        category: "Bodyweight",
        muscle_group: "Shoulders",
        name: "Shoulder External 90°",
        description: "90-degree shoulder rotation exercise",
      },
      {
        difficulty_level: 2,
        category: "Bodyweight",
        name: "Shoulder External",
        muscle_group: "Shoulders",
        description: "Shoulder external rotation",
      },
      {
        name: "Side Bridge",
        difficulty_level: 2,
        category: "Bodyweight",
        muscle_group: "Obliques",
        description: "Side plank hold",
      },
      {
        name: "Side Crunch",
        difficulty_level: 2,
        category: "Bodyweight",
        muscle_group: "Obliques",
        description: "Crunch targeting obliques",
      },
      {
        difficulty_level: 2,
        name: "Side Hip Raise",
        category: "Bodyweight",
        muscle_group: "Obliques",
        description: "Side crunch with hip raise",
      },
      {
        name: "Side Lunge",
        difficulty_level: 2,
        muscle_group: "Legs",
        category: "Bodyweight",
        description: "Lunging to the side",
      },
      {
        difficulty_level: 3,
        muscle_group: "Legs",
        category: "Bodyweight",
        name: "Side Split Squat",
        description: "Split squat with side stance",
      },
      {
        category: "Cardio",
        difficulty_level: 1,
        muscle_group: "Cardio",
        name: "Simplified Jumping Jack",
        description: "Low-impact jumping jack",
      },
      {
        name: "Sit-Up",
        difficulty_level: 2,
        muscle_group: "Abs",
        category: "Bodyweight",
        description: "Classic sit-up exercise",
      },
      {
        name: "Split Squat",
        difficulty_level: 2,
        muscle_group: "Legs",
        category: "Bodyweight",
        description: "Stationary split squat",
      },
      {
        name: "Squat Jump",
        difficulty_level: 3,
        muscle_group: "Legs",
        category: "Bodyweight",
        description: "Explosive jump from squat",
      },
      {
        name: "Sumo Squat",
        difficulty_level: 2,
        muscle_group: "Legs",
        category: "Bodyweight",
        description: "Wide-stance squat",
      },
      {
        difficulty_level: 3,
        muscle_group: "Legs",
        category: "Bodyweight",
        name: "Sumo Squat Jump",
        description: "Jumping from sumo squat",
      },
      {
        name: "Wall Sit",
        difficulty_level: 2,
        muscle_group: "Legs",
        category: "Bodyweight",
        description: "Isometric wall sit hold",
      },
      {
        difficulty_level: 4,
        muscle_group: "Back",
        category: "Bodyweight",
        name: "Wide Grip Pull-Up",
        description: "Pull-up with wide grip",
      },
      {
        name: "Wipers",
        difficulty_level: 3,
        muscle_group: "Abs",
        category: "Bodyweight",
        description: "Core rotation wiper movement",
      },
      {
        category: "Cardio",
        difficulty_level: 1,
        muscle_group: "Cardio",
        name: "Running In Place",
        description: "Stationary running exercise",
      },
    ],
  }); // Avatars
  const styles = [
    "adventurer",
    "big-smile",
    "avataaars",
    "big-ears",
    "bottts",
    "personas",
  ];

  // Cool names for avatars
  const firstNames = [
    "Ace",
    "Blaze",
    "Cruz",
    "Dash",
    "Echo",
    "Falcon",
    "Ghost",
    "Hunter",
    "Ivy",
    "Jax",
    "Kai",
    "Luna",
    "Max",
    "Nova",
    "Onyx",
    "Phoenix",
    "Quinn",
    "Raven",
    "Storm",
    "Titan",
    "Viper",
    "Wolf",
    "Xander",
    "Zara",
    "Atlas",
    "Bolt",
    "Cinder",
    "Drake",
    "Ember",
    "Frost",
    "Hawk",
    "Iris",
    "Jet",
    "Knox",
    "Lux",
    "Myth",
    "Nero",
    "Orion",
    "Pixel",
    "Quill",
    "Rex",
    "Sage",
    "Talon",
    "Ultra",
    "Vex",
    "Wren",
    "Xtreme",
    "Zephyr",
  ];

  const lastNames = [
    "Stone",
    "Fire",
    "Shadow",
    "Storm",
    "Blade",
    "Wolf",
    "Hawk",
    "Frost",
    "Night",
    "Steel",
    "Thunder",
    "Viper",
    "Phoenix",
    "Raven",
    "Hunter",
    "Titan",
    "Ember",
    "Bolt",
    "Fang",
    "Claw",
    "Spike",
    "Rage",
    "Fury",
    "Blaze",
    "Sage",
    "Wild",
    "Fierce",
    "Strong",
    "Swift",
    "Brave",
    "Bold",
    "Sharp",
    "Quick",
    "Loud",
    "Bright",
    "Dark",
    "Light",
    "Hard",
    "Soft",
    "Calm",
    "Pure",
    "True",
    "Free",
    "High",
    "Deep",
    "Wide",
    "Fast",
    "Slow",
  ];
  // Function to get random name
  const getRandomName = (usedNames = new Set()) => {
    let name;
    do {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      name = `${firstName} ${lastName}`;
    } while (usedNames.has(name));
    usedNames.add(name);
    return name;
  };

  const usedNames = new Set();

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
      name: getRandomName(usedNames),
      image_url: "https://api.dicebear.com/6.x/adventurer/svg?seed=gainplay1",
    },
    {
      price: 0,
      rarity: "common",
      name: getRandomName(usedNames),
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
        name: getRandomName(usedNames),
        price: basePrice + styleIndex * 20, // Style variation in price
        image_url: `https://api.dicebear.com/6.x/${style}/svg?seed=${seed}`,
      });
    }
  });

  // Premium special avatars - Legendary rarity
  const premiumAvatars = [
    {
      price: 500,
      rarity: "legendary",
      name: getRandomName(usedNames),
      image_url:
        "https://api.dicebear.com/6.x/avataaars/svg?seed=fitnesspro&clothesColor=3c4f5c&clothes=overall&hairColor=2c1b18&facialHairColor=2c1b18&facialHair=beardMajestic&eyes=surprised&eyebrows=raisedExcited",
    },
    {
      price: 550,
      rarity: "legendary",
      name: getRandomName(usedNames),
      image_url:
        "https://api.dicebear.com/6.x/avataaars/svg?seed=gymmaster&clothesColor=ff0000&clothes=hoodie&top=shortCurly&hairColor=000000&facialHairColor=000000&facialHair=beardLight&eyes=default&eyebrows=default",
    },
    {
      price: 600,
      rarity: "legendary",
      name: getRandomName(usedNames),
      image_url:
        "https://api.dicebear.com/6.x/avataaars/svg?seed=cardioking&clothesColor=0000ff&clothes=shirtScoopNeck&top=shortWaved&hairColor=a52a2a&facialHairColor=a52a2a&eyes=happy&eyebrows=default",
    },
    {
      price: 650,
      rarity: "legendary",
      name: getRandomName(usedNames),
      image_url:
        "https://api.dicebear.com/9.x/notionists/svg?seed=legendary&backgroundColor=ffffff&backgroundType=gradientLinear&brows=variant01,variant02,variant12&lips=variant01,variant16,variant30&nose=variant01,variant18&glassesProbability=50",
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

  console.log("Database seeding completed successfully!");
  console.log("Added:");
  console.log(`- ${badges.length} badges`);
  console.log("- 6 goals");
  console.log("- 70 exercises");
  console.log(`- ${allAvatars.length} avatars`);
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
