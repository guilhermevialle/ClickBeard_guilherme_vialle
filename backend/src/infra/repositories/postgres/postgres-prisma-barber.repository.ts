import { inject, injectable } from "tsyringe";
import { Barber } from "../../../domain/aggregates/barber";
import { BarberWorkday } from "../../../domain/entities/barber-workday";
import { BarberWorkdayShift } from "../../../domain/entities/barber-workday-shift";
import { IBarberRepository } from "../../interfaces/repositories/barber-repository.interface";
import type { PrismaClientType } from "./prisma/client";

@injectable()
export class PostgresPrismaBarberRepository implements IBarberRepository {
  constructor(@inject("PrismaClient") private prisma: PrismaClientType) {}

  private mapToDomain(barber: any): Barber {
    return Barber.from({
      id: barber.id,
      name: barber.name,
      age: barber.age,
      hiredAt: barber.hiredAt,
      workdays: barber.workdays.map((wd: any) =>
        BarberWorkday.from({
          id: wd.id,
          barberId: wd.barberId,
          weekday: wd.weekday,
          shifts: wd.shifts.map((s: any) =>
            BarberWorkdayShift.from({
              id: s.id,
              workdayId: s.barberWorkdayId,
              endAtInMinutes: s.endAtInMinutes,
              startAtInMinutes: s.startAtInMinutes,
            })
          ),
        })
      ),
    });
  }

  async findAll(): Promise<Barber[]> {
    const barbers = await this.prisma.barber.findMany({
      include: {
        workdays: {
          include: {
            shifts: true,
          },
        },
      },
    });

    return barbers.map(this.mapToDomain);
  }

  async findById(id: string): Promise<Barber | null> {
    const barber = await this.prisma.barber.findUnique({
      where: { id },
      include: {
        workdays: {
          include: {
            shifts: true,
          },
        },
      },
    });

    return barber ? this.mapToDomain(barber) : null;
  }

  async findByName(name: string): Promise<Barber | null> {
    const barber = await this.prisma.barber.findUnique({
      where: { name },
      include: {
        workdays: {
          include: {
            shifts: true,
          },
        },
      },
    });

    return barber ? this.mapToDomain(barber) : null;
  }

  async save(barber: Barber): Promise<void> {
    await this.prisma.barber.upsert({
      where: { id: barber.id },
      create: {
        id: barber.id,
        name: barber.name,
        age: barber.age,
        hiredAt: barber.hiredAt,
        workdays: {
          create: barber.workdays.map((wd) => ({
            id: wd.id,
            weekday: wd.weekday,
            shifts: {
              create: wd.shifts.map((s) => ({
                id: s.id,
                startAtInMinutes: s.startAtInMinutes,
                endAtInMinutes: s.endAtInMinutes,
              })),
            },
          })),
        },
      },
      update: {
        name: barber.name,
        age: barber.age,
        workdays: {
          deleteMany: {},
          create: barber.workdays.map((wd) => ({
            id: wd.id,
            weekday: wd.weekday,
            shifts: {
              create: wd.shifts.map((s) => ({
                id: s.id,
                startAtInMinutes: s.startAtInMinutes,
                endAtInMinutes: s.endAtInMinutes,
              })),
            },
          })),
        },
      },
    });
  }
}
