import { Appointment } from "../../../domain/entities/appointment";

export interface IAppointmentRepository {
  save: (appointment: Appointment) => Promise<void>;
  findByCustomerId: (customerId: string) => Promise<Appointment[]>;
  findByBarberId: (barberId: string) => Promise<Appointment[]>;
  findAll: () => Promise<Appointment[]>;
}
