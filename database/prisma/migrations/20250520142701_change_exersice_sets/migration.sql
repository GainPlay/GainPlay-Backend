/*
  Warnings:

  - You are about to drop the column `completed` on the `exercise_sets` table. All the data in the column will be lost.
  - You are about to drop the column `completed_at` on the `exercise_sets` table. All the data in the column will be lost.
  - You are about to drop the column `sets` on the `workout_exercises` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "exercise_sets" DROP COLUMN "completed",
DROP COLUMN "completed_at",
ADD COLUMN     "completed_reps" INTEGER;

-- AlterTable
ALTER TABLE "workout_exercises" DROP COLUMN "sets";
