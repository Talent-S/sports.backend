/*
  Warnings:

  - You are about to drop the column `duration` on the `plans` table. All the data in the column will be lost.
  - Added the required column `interval` to the `plans` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlanInterval" AS ENUM ('day', 'week', 'month', 'year', 'one_time');

-- AlterTable
ALTER TABLE "plans" DROP COLUMN "duration",
ADD COLUMN     "interval" "PlanInterval" NOT NULL;
