import { inject, injectable } from "tsyringe";
import { Appointment } from "../../domain/entities/appointment";
import type { IAppointmentRepository } from "../../infra/interfaces/repositories/appointment-repository.interface";
import type { ICustomerRepository } from "../../infra/interfaces/repositories/customer-repository.interface";
import type { IBarberAvailabilityService } from "../../infra/interfaces/services/barber-availability-service.interface";
import {
  BarberNotAvailableError,
  CustomerNotFoundError,
  PendingAppointmentError,
} from "../errors/shared";

interface Request {
  barberId: string;
  customerId: string;
  specialtyId: string;
  startAt: Date;
}

@injectable()
export class CreateAppointment {
  constructor(
    @inject("AppointmentRepository")
    private readonly appointmentRepo: IAppointmentRepository,
    @inject("CustomerRepository")
    private readonly customerRepo: ICustomerRepository,
    @inject("BarberAvailabilityService")
    private readonly barberAvailabilityService: IBarberAvailabilityService
  ) {}

  async execute({
    customerId,
    barberId,
    specialtyId,
    startAt,
  }: Request): Promise<Appointment> {
    const customer = await this.customerRepo.findById(customerId);

    if (!customer)
      throw new CustomerNotFoundError(
        `Customer with id ${customerId} not found.`
      );

    const isSlotAvailable =
      await this.barberAvailabilityService.isSlotAvailable(barberId, startAt);

    if (!isSlotAvailable)
      throw new BarberNotAvailableError(
        `Barber with id ${barberId} is not available at ${startAt}.`
      );

    const customerAppointments =
      await this.appointmentRepo.findByCustomerId(customerId);

    const hasActive = customerAppointments.some((a) => !a.wasFinished);

    if (hasActive)
      throw new PendingAppointmentError(
        `Customer with id ${customerId} already has an active appointment.`
      );

    const appointment = Appointment.create({
      barberId,
      customerId,
      specialtyId,
      startAt,
      durationInMinutes: 30,
    });

    await this.appointmentRepo.save(appointment);

    return appointment;
  }
}
