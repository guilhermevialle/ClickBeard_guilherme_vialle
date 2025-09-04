import { inject, injectable } from "tsyringe";
import { Specialty } from "../../../domain/entities/specialty";
import { ISpecialtyRepository } from "../../interfaces/repositories/specialty-repository.interface";
import type { PrismaClientType } from "./prisma/client";

@injectable()
export class PostgresPrismaSpecialtyRepository implements ISpecialtyRepository {
  constructor(@inject("PrismaClient") private prisma: PrismaClientType) {}

  async save(specialty: Specialty): Promise<void> {
    await this.prisma.specialty.create({
      data: {
        id: specialty.id,
        name: specialty.name,
        durationInMinutes: specialty.durationInMinutes,
      },
    });
  }

  async findByName(name: string): Promise<Specialty | null> {
    const specialty = await this.prisma.specialty.findUnique({
      where: { name },
    });

    if (!specialty) return null;

    return Specialty.from({
      id: specialty.id,
      name: specialty.name,
      durationInMinutes: specialty.durationInMinutes,
    });
  }

  async findById(id: string): Promise<Specialty | null> {
    const specialty = await this.prisma.specialty.findUnique({
      where: { id },
    });

    if (!specialty) return null;

    return Specialty.from({
      id: specialty.id,
      name: specialty.name,
      durationInMinutes: specialty.durationInMinutes,
    });
  }

  async findAll(): Promise<Specialty[]> {
    const specialties = await this.prisma.specialty.findMany();

    return specialties.map((specialty) =>
      Specialty.from({
        id: specialty.id,
        name: specialty.name,
        durationInMinutes: specialty.durationInMinutes,
      })
    );
  }
}
