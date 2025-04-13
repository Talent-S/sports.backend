/*
  Warnings:

  - You are about to drop the column `mobile_number` on the `UserProfile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UserProfile_mobile_number_key";

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "mobile_number";
