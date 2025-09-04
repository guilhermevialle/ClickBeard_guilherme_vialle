import { isBefore } from "date-fns";
import { inject, injectable } from "tsyringe";
import z from "zod";
import { Barber } from "../../domain/aggregates/barber";
import { BarberSpecialty } from "../../domain/entities/barber-specialty";
import { BarberFactory } from "../../domain/factory/barber.factory";
import type { IBarberRepository } from "../../infra/interfaces/repositories/barber-repository.interface";
import type { IBarberSpecialtyRepository } from "../../infra/interfaces/repositories/barber-specialty-repository.interface";
import type { ISpecialtyRepository } from "../../infra/interfaces/repositories/specialty-repository";
import { BarberAlreadyExistsError } from "../errors/shared";

export const createBarberWithSpecialtiesSchemaDto = z.object({
  name: z.string("Name must be a string").min(1),
  age: z
    .number("Age must be a number")
    .positive("Age must be greater than 0")
    .int("Age must be an integer"),
  hiredAt: z.coerce
    .date("HiredAt must be a valid date")
    .refine((date) => isBefore(date, new Date()), {
      message: "HiredAt must be in the past",
    }),
  specialtyIds: z
    .array(
      z.string("SpecialtyId must be a string"),
      "SpecialtyIds must be an string array"
    )
    .min(1, "Barber must have at least 1 specialty"),
});

export type CreateBarberWithSpecialtiesDto = z.infer<
  typeof createBarberWithSpecialtiesSchemaDto
>;

@injectable()
export class CreateBarberWithSpecialties {
  constructor(
    @inject("BarberRepository")
    private readonly barberRepo: IBarberRepository,
    @inject("SpecialtyRepository")
    private readonly specialtyRepo: ISpecialtyRepository,
    @inject("BarberSpecialtyRepository")
    private readonly barberSpecialtyRepo: IBarberSpecialtyRepository
  ) {}

  async execute({
    age,
    hiredAt,
    name,
    specialtyIds,
  }: CreateBarberWithSpecialtiesDto): Promise<Barber> {
    const barberExits = await this.barberRepo.findByName(name);
    if (barberExits)
      throw new BarberAlreadyExistsError(
        `Barber with name ${barberExits.name} already exists`
      );

    const barber = BarberFactory.createWithWorkdaysAndShifts({
      age,
      name,
      hiredAt,
    });
    await this.barberRepo.save(barber);

    const specialties = await Promise.all(
      specialtyIds.map((id) => this.specialtyRepo.findById(id))
    );

    const nonNullSpecialtyIds = specialties
      .filter((s) => s !== null)
      .map((s) => s.id);

    const barberSpecialties = nonNullSpecialtyIds.map((specialtyId) =>
      BarberSpecialty.create({ barberId: barber.id, specialtyId })
    );

    console.log({ barberSpecialties });

    await Promise.all(
      barberSpecialties.map((bs) => this.barberSpecialtyRepo.save(bs))
    );

    return barber;
  }
}
