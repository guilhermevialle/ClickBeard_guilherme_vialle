export interface IBarberAvailabilityService {
  findAvailableSlotsByBarberIdAndDate(
    barberId: string,
    date: Date
  ): Promise<number[]>;
  isSlotAvailable(barberId: string, startAt: Date): Promise<boolean>;
}
