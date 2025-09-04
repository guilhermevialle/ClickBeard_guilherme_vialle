import { inject, injectable } from "tsyringe";
import { BarberSpecialty } from "../../../domain/entities/barber-specialty";
import { IBarberSpecialtyRepository } from "../../interfaces/repositories/barber-specialty-repository.interface";
import type { PrismaClientType } from "./prisma/client";

@injectable()
export class PostgresPrismaBarberSpecialtyRepository
  implements IBarberSpecialtyRepository
{
  constructor(@inject("PrismaClient") private prisma: PrismaClientType) {}

  async findSpecialtiesByBarberId(
    barberId: string
  ): Promise<BarberSpecialty[]> {
    const barberSpecialties = await this.prisma.barberSpecialty.findMany({
      where: {
        barberId,
      },
    });

    return barberSpecialties.map((bs) =>
      BarberSpecialty.from({
        id: bs.id,
        barberId: bs.barberId,
        specialtyId: bs.specialtyId,
      })
    );
  }

  async findAll(): Promise<BarberSpecialty[]> {
    const barberSpecialties = await this.prisma.barberSpecialty.findMany();

    return barberSpecialties.map((bs) =>
      BarberSpecialty.from({
        id: bs.id,
        barberId: bs.barberId,
        specialtyId: bs.specialtyId,
      })
    );
  }

  async save(barberSpecialty: BarberSpecialty): Promise<void> {
    await this.prisma.barberSpecialty.create({
      data: {
        id: barberSpecialty.id,
        barberId: barberSpecialty.barberId,
        specialtyId: barberSpecialty.specialtyId,
      },
    });
  }

  async delete(barberSpecialty: BarberSpecialty): Promise<void> {
    await this.prisma.barberSpecialty.delete({
      where: {
        id: barberSpecialty.id,
      },
    });
  }
}
