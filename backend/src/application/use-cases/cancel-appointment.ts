import { inject, injectable } from "tsyringe";
import type { IAppointmentRepository } from "../../infra/interfaces/repositories/appointment-repository.interface";
import { AppointmentNotFoundError } from "../errors/shared";

interface Request {
  id: string;
}

@injectable()
export class CancelAppointment {
  constructor(
    @inject("AppointmentRepository")
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute({ id }: Request) {
    const appointment = await this.appointmentRepo.findById(id);

    if (!appointment)
      throw new AppointmentNotFoundError(
        `Appointment with id ${id} not found.`
      );

    appointment.cancel();

    await this.appointmentRepo.update(appointment);
  }
}
