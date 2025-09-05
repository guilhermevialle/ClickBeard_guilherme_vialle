/*
  Warnings:

  - Changed the type of `status` on the `Appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('CONFIRMED', 'CANCELLED', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "status",
ADD COLUMN     "status" "public"."AppointmentStatus" NOT NULL;
