import { Appointment } from "../../../domain/entities/appointment";
import { IAppointmentRepository } from "../../interfaces/repositories/appointment-repository.interface";

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  async update(appointment: Appointment): Promise<void> {
    const index = this.appointments.findIndex((a) => a.id === appointment.id);
    this.appointments[index] = appointment;
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.appointments.find((a) => a.id === id) ?? null;
  }

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
