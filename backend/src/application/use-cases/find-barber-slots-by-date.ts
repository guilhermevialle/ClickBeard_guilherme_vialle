import { inject, injectable } from "tsyringe";
import type { IBarberAvailabilityService } from "../../infra/interfaces/services/barber-availability-service.interface";

interface Request {
  barberId: string;
  date: Date;
}

@injectable()
export class FindBarberSlotsByDate {
  constructor(
    @inject("BarberAvailabilityService")
    private readonly barberAvailabilityService: IBarberAvailabilityService
  ) {}

  async execute({ barberId, date }: Request) {
    return this.barberAvailabilityService.findAvailableSlotsByBarberIdAndDate(
      barberId,
      date
    );
  }
}
