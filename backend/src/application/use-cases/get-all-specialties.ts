import { inject, injectable } from "tsyringe";
import { Specialty } from "../../domain/entities/specialty";
import type { ISpecialtyRepository } from "../../infra/interfaces/repositories/specialty-repository.interface";

@injectable()
export class GetAllSpecialties {
  constructor(
    @inject("SpecialtyRepository")
    private readonly specialtyRepo: ISpecialtyRepository
  ) {}

  async execute(): Promise<Specialty[]> {
    return await this.specialtyRepo.findAll();
  }
}
