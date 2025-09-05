import { isSameDay } from "date-fns";
import { inject, injectable } from "tsyringe";
import type { IAppointmentRepository } from "../../infra/interfaces/repositories/appointment-repository.interface";
import type { IBarberRepository } from "../../infra/interfaces/repositories/barber-repository.interface";
import type { ICustomerRepository } from "../../infra/interfaces/repositories/customer-repository.interface";
import type { ISpecialtyRepository } from "../../infra/interfaces/repositories/specialty-repository.interface";

type Response = Array<{
  id: string;
  barberName: string;
  customerName: string;
  specialtyName: string;
  durationInMinutes: number;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: Date;
  updatedAt: Date;
}>;

interface Request {
  date: Date;
}

@injectable()
export class GetAdminDashboardDataBff {
  constructor(
    @inject("CustomerRepository")
    private readonly customerRepo: ICustomerRepository,
    @inject("BarberRepository")
    private readonly barberRepo: IBarberRepository,
    @inject("AppointmentRepository")
    private readonly appointmentRepo: IAppointmentRepository,
    @inject("SpecialtyRepository")
    private readonly specialtyRepo: ISpecialtyRepository
  ) {}

  async execute({ date }: Request): Promise<Response> {
    const appointments = (await this.appointmentRepo.findAll()).filter((a) =>
      isSameDay(a.startAt, date)
    );

    return Promise.all(
      appointments.map(async (a) => {
        const [barber, customer] = await Promise.all([
          this.barberRepo.findById(a.barberId),
          this.customerRepo.findById(a.customerId),
        ]);

        if (!barber || !customer)
          throw new Error("Barber or Customer not found");

        const specialty = await this.specialtyRepo.findById(a.specialtyId);

        return {
          id: a.id,
          barberName: barber.name,
          customerName: customer.name,
          specialtyName: specialty?.name || "Unknown",
          durationInMinutes: a.durationInMinutes,
          status: a.status,
          startAt: a.startAt,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        };
      })
    );
  }
}
