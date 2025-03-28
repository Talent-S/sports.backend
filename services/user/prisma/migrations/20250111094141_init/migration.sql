-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'artist', 'expert', 'sponser');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "photo" TEXT,
    "gender" "Gender",
    "age" INTEGER,
    "birth_year" INTEGER,
    "language" TEXT[],
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "skin_color" TEXT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "bio" TEXT,
    "social_links" JSONB,
    "interests" TEXT[],
    "profession" TEXT,
    "subProfession" TEXT,
    "company" TEXT,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_mobile_number_key" ON "UserProfile"("mobile_number");
