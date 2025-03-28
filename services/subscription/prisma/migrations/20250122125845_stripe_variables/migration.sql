/*
  Warnings:

  - A unique constraint covering the columns `[stripe_price_id]` on the table `plans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_product_id]` on the table `plans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_id]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripe_price_id` to the `plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripe_product_id` to the `plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripe_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "stripe_price_id" TEXT NOT NULL,
ADD COLUMN     "stripe_product_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "stripe_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "plans_stripe_price_id_key" ON "plans"("stripe_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "plans_stripe_product_id_key" ON "plans"("stripe_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_id_key" ON "subscriptions"("stripe_id");
