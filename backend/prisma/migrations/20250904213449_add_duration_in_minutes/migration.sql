/*
  Warnings:

  - Added the required column `durationInMinutes` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "durationInMinutes" INTEGER NOT NULL;
