import { inject, injectable } from "tsyringe";
import { BarberSpecialty } from "../../domain/entities/barber-specialty";
import type { IBarberSpecialtyRepository } from "../../infra/interfaces/repositories/barber-specialty-repository.interface";

@injectable()
export class GetAllBarberSpecialty {
  constructor(
    @inject("BarberSpecialtyRepository")
    private readonly barberSpecialtyRepo: IBarberSpecialtyRepository
  ) {}

  async execute(): Promise<BarberSpecialty[]> {
    return this.barberSpecialtyRepo.findAll();
  }
}
