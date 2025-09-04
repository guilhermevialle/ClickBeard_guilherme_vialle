/*
  Warnings:

  - Made the column `barberId` on table `BarberWorkday` required. This step will fail if there are existing NULL values in that column.
  - Made the column `barberWorkdayId` on table `BarberWorkdayShift` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."BarberWorkday" DROP CONSTRAINT "BarberWorkday_barberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BarberWorkdayShift" DROP CONSTRAINT "BarberWorkdayShift_barberWorkdayId_fkey";

-- AlterTable
ALTER TABLE "public"."BarberWorkday" ALTER COLUMN "barberId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."BarberWorkdayShift" ALTER COLUMN "barberWorkdayId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."BarberWorkday" ADD CONSTRAINT "BarberWorkday_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "public"."Barber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BarberWorkdayShift" ADD CONSTRAINT "BarberWorkdayShift_barberWorkdayId_fkey" FOREIGN KEY ("barberWorkdayId") REFERENCES "public"."BarberWorkday"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
