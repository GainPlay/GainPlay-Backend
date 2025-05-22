/*
  Warnings:

  - You are about to drop the column `experience_earnd` on the `workouts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workouts" DROP COLUMN "experience_earnd",
ADD COLUMN     "experience_earned" INTEGER;
