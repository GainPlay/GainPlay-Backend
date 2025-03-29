import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const seed = async () => {
  // Example of upserting a record
  // await prisma.XXXX.upsert()
};

seed()
  .then(() => {
    console.log("Seed complete");
    prisma.$disconnect();
  })
  .catch(error => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
