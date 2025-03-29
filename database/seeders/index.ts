import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const seed = async () => {
  const goals = [
    {
      id: 1,
      name: "muscle gain",
      description: "How much would you like to gain muscle?",
    },
    {
      id: 2,
      name: "flexibility improvement",
      description: "How important is improving flexibility to you?",
    },
    {
      id: 3,
      name: "stamina increasement",
      description: "How much would you like to increase your stamina?",
    },
  ];

  for (const goal of goals) {
    await prisma.goals.upsert({
      where: { id: goal.id },
      update: {}, // No update for now
      create: goal,
    });
  }
};

seed()
  .then(() => {
    console.log("Seed complete");
    return prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
