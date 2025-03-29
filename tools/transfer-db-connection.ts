import { writeFileSync } from "fs";

// Specify the file path to write the connection string
const filePath = "./database/prisma/.env";

// Write connection string to file
writeFileSync(filePath, `DATABASE_URL=${process.env.DATABASE_URL}`);

console.log(`Connection string written to ${filePath}`);
