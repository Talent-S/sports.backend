/*
  Warnings:

  - You are about to drop the column `featureId` on the `plan_features` table. All the data in the column will be lost.
  - Added the required column `feature_id` to the `plan_features` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "plan_features" DROP CONSTRAINT "plan_features_featureId_fkey";

-- AlterTable
ALTER TABLE "plan_features" DROP COLUMN "featureId",
ADD COLUMN     "feature_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
