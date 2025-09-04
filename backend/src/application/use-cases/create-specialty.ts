import { inject, injectable } from "tsyringe";
import { Specialty } from "../../domain/entities/specialty";
import type { ISpecialtyRepository } from "../../infra/interfaces/repositories/specialty-repository.interface";
import { SpecialtyAlreadyExistsError } from "../errors/shared";

interface CreateSpecialtyDto {
  name: string;
  durationInMinutes: number;
}

@injectable()
export class CreateSpecialty {
  constructor(
    @inject("SpecialtyRepository")
    private readonly specialtyRepo: ISpecialtyRepository
  ) {}

  async execute({
    durationInMinutes,
    name,
  }: CreateSpecialtyDto): Promise<Specialty> {
    const exists = await this.specialtyRepo.findByName(name);
    if (exists)
      throw new SpecialtyAlreadyExistsError(`Specialty ${name} already exists`);

    const specialty = Specialty.create({
      name,
      durationInMinutes,
    });

    await this.specialtyRepo.save(specialty);

    return specialty;
  }
}
