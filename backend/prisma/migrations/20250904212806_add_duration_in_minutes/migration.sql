/*
  Warnings:

  - Added the required column `durationInMinutes` to the `Specialty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Specialty" ADD COLUMN     "durationInMinutes" INTEGER NOT NULL;
