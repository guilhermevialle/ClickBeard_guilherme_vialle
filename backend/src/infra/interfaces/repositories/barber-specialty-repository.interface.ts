import { BarberSpecialty } from "../../../domain/entities/barber-specialty";

export interface IBarberSpecialtyRepository {
  save(barberSpecialty: BarberSpecialty): Promise<void>;
  delete(barberSpecialty: BarberSpecialty): Promise<void>;
  findAll(): Promise<BarberSpecialty[]>;
  findSpecialtiesByBarberId(barberId: string): Promise<BarberSpecialty[]>;
}
