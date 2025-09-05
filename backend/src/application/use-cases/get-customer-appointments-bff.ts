import { inject, injectable } from "tsyringe";
import type { IAppointmentRepository } from "../../infra/interfaces/repositories/appointment-repository.interface";
import type { IBarberRepository } from "../../infra/interfaces/repositories/barber-repository.interface";
import type { ISpecialtyRepository } from "../../infra/interfaces/repositories/specialty-repository.interface";

interface Request {
  customerId: string;
}

type Response = {
  id: string;
  barber: {
    id: string;
    name: string;
  };
  specialty: {
    id: string;
    name: string;
  };
  startAt: Date;
  durationInMinutes: number;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: Date;
  updatedAt: Date;
};

@injectable()
export class GetCustomerAppointmentsBff {
  constructor(
    @inject("AppointmentRepository")
    private readonly appointmentRepo: IAppointmentRepository,
    @inject("BarberRepository")
    private readonly barberRepo: IBarberRepository,
    @inject("SpecialtyRepository")
    private readonly specialtyRepo: ISpecialtyRepository
  ) {}

  async execute({ customerId }: Request): Promise<Response[]> {
    const appointments =
      await this.appointmentRepo.findByCustomerId(customerId);

    return Promise.all(
      appointments.map(async (a) => {
        const barber = await this.barberRepo.findById(a.barberId);
        const specialty = await this.specialtyRepo.findById(a.specialtyId);

        return {
          id: a.id,
          barber: {
            id: barber!.id,
            name: barber!.name,
          },
          specialty: {
            id: specialty!.id,
            name: specialty!.name,
          },
          startAt: a.startAt,
          status: a.status,
          durationInMinutes: a.durationInMinutes,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        };
      })
    );
  }
}
