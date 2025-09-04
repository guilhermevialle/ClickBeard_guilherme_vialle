import { inject, injectable } from "tsyringe";
import type { IBarberRepository } from "../../infra/interfaces/repositories/barber-repository.interface";
import type { IBarberSpecialtyRepository } from "../../infra/interfaces/repositories/barber-specialty-repository.interface";
import type { ISpecialtyRepository } from "../../infra/interfaces/repositories/specialty-repository";

interface GetAllBarbersForBffResponseDto {
  id: string;
  name: string;
  hiredAt: Date;
  specialties: {
    id: string;
    name: string;
  }[];
}

@injectable()
export class GetAllBarbersForBff {
  constructor(
    @inject("BarberRepository")
    private readonly barberRepo: IBarberRepository,

    @inject("SpecialtyRepository")
    private readonly specialtyRepo: ISpecialtyRepository,

    @inject("BarberSpecialtyRepository")
    private readonly barberSpecialtyRepo: IBarberSpecialtyRepository
  ) {}

  async execute(): Promise<GetAllBarbersForBffResponseDto[]> {
    const barbers = await this.barberRepo.findAll();

    return Promise.all(
      barbers.map(async (barber) => {
        const barberSpecialties =
          await this.barberSpecialtyRepo.findSpecialtiesByBarberId(barber.id);

        const specialties = await Promise.all(
          barberSpecialties.map(async (bs) => {
            const specialty = await this.specialtyRepo.findById(bs.specialtyId);
            return specialty
              ? { id: specialty.id, name: specialty.name }
              : null;
          })
        );

        return {
          id: barber.id,
          name: barber.name,
          hiredAt: barber.hiredAt,
          specialties: specialties.filter(
            (s): s is { id: string; name: string } => s !== null
          ),
        };
      })
    );
  }
}
