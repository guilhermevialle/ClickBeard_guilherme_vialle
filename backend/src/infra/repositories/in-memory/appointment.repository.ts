import { Appointment } from "../../../domain/entities/appointment";
import { IAppointmentRepository } from "../../interfaces/repositories/appointment-repository.interface";

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  async findByCustomerId(customerId: string): Promise<Appointment[]> {
    return this.appointments.filter((a) => a.customerId === customerId);
  }

  async findAll(): Promise<Appointment[]> {
    return [...this.appointments];
  }

  async findByBarberId(barberId: string): Promise<Appointment[]> {
    return this.appointments.filter((a) => a.barberId === barberId);
  }

  async save(appointment: Appointment): Promise<void> {
    this.appointments.push(appointment);
  }
}
