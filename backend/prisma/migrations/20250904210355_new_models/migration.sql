-- CreateTable
CREATE TABLE "public"."Barber" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "hiredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Barber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BarberWorkday" (
    "id" TEXT NOT NULL,
    "barberId" TEXT,
    "weekday" INTEGER NOT NULL,

    CONSTRAINT "BarberWorkday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BarberWorkdayShift" (
    "id" TEXT NOT NULL,
    "barberWorkdayId" TEXT,
    "startAtInMinutes" INTEGER NOT NULL,
    "endAtInMinutes" INTEGER NOT NULL,

    CONSTRAINT "BarberWorkdayShift_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."BarberWorkday" ADD CONSTRAINT "BarberWorkday_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "public"."Barber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BarberWorkdayShift" ADD CONSTRAINT "BarberWorkdayShift_barberWorkdayId_fkey" FOREIGN KEY ("barberWorkdayId") REFERENCES "public"."BarberWorkday"("id") ON DELETE SET NULL ON UPDATE CASCADE;
