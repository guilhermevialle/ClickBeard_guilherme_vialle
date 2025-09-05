-- DropForeignKey
ALTER TABLE "public"."BarberWorkday" DROP CONSTRAINT "BarberWorkday_barberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BarberWorkdayShift" DROP CONSTRAINT "BarberWorkdayShift_barberWorkdayId_fkey";

-- AddForeignKey
ALTER TABLE "public"."BarberWorkday" ADD CONSTRAINT "BarberWorkday_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "public"."Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BarberWorkdayShift" ADD CONSTRAINT "BarberWorkdayShift_barberWorkdayId_fkey" FOREIGN KEY ("barberWorkdayId") REFERENCES "public"."BarberWorkday"("id") ON DELETE CASCADE ON UPDATE CASCADE;
