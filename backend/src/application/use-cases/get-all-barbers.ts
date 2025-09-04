import { inject, injectable } from "tsyringe";
import { Barber } from "../../domain/aggregates/barber";
import type { IBarberRepository } from "../../infra/interfaces/repositories/barber-repository.interface";

@injectable()
export class GetAllBarbers {
  constructor(
    @inject("BarberRepository")
    private readonly barberRepo: IBarberRepository
  ) {}

  async execute(): Promise<Barber[]> {
    return this.barberRepo.findAll();
  }
}
