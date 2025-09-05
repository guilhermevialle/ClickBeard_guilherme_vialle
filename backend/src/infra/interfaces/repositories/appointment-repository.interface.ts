import { Appointment } from "../../../domain/entities/appointment";

export interface IAppointmentRepository {
  save: (appointment: Appointment) => Promise<void>;
  update: (appointment: Appointment) => Promise<void>;
  findById: (id: string) => Promise<Appointment | null>;
  findByCustomerId: (customerId: string) => Promise<Appointment[]>;
  findByBarberId: (barberId: string) => Promise<Appointment[]>;
  findAll: () => Promise<Appointment[]>;
}
