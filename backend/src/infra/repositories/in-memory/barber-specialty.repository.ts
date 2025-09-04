import { BarberSpecialty } from "../../../domain/entities/barber-specialty";
import { IBarberSpecialtyRepository } from "../../interfaces/repositories/barber-specialty-repository.interface";

export class InMemoryBarberSpecialtyRepository
  implements IBarberSpecialtyRepository
{
  private storage: BarberSpecialty[] = [];

  async findSpecialtiesByBarberId(
    barberId: string
  ): Promise<BarberSpecialty[]> {
    return this.storage.filter((bs) => bs.barberId === barberId);
  }

  async save(barberSpecialty: BarberSpecialty): Promise<void> {
    this.storage.push(barberSpecialty);
  }

  async delete(barberSpecialty: BarberSpecialty): Promise<void> {
    this.storage = this.storage.filter((bs) => bs.id !== barberSpecialty.id);
  }

  async findAll(): Promise<BarberSpecialty[]> {
    return [...this.storage];
  }
}
