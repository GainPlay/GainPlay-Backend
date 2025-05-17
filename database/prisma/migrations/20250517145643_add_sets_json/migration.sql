/*
  Warnings:

  - You are about to drop the column `total_reps` on the `workout_exercises` table. All the data in the column will be lost.
  - Made the column `user_id` on table `friendships` required. This step will fail if there are existing NULL values in that column.
  - Made the column `friend_id` on table `friendships` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `friendships` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "friendships" DROP CONSTRAINT "friendships_friend_id_fkey";

-- DropForeignKey
ALTER TABLE "friendships" DROP CONSTRAINT "friendships_user_id_fkey";

-- AlterTable
ALTER TABLE "friendships" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "friend_id" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "workout_exercises" DROP COLUMN "total_reps",
ADD COLUMN     "sets" JSONB[];

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
