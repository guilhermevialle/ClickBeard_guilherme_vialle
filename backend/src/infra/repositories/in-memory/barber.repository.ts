import { Barber } from "../../../domain/aggregates/barber";
import { IBarberRepository } from "../../interfaces/repositories/barber-repository.interface";

export class InMemoryBarberRepository implements IBarberRepository {
  private barbers: Barber[] = [];

  async save(barber: Barber): Promise<void> {
    this.barbers.push(barber);
  }

  async findAll(): Promise<Barber[]> {
    return [...this.barbers];
  }

  async findById(id: string): Promise<Barber | null> {
    return this.barbers.find((barber) => barber.id === id) ?? null;
  }

  async findByName(name: string): Promise<Barber | null> {
    return this.barbers.find((barber) => barber.name === name) ?? null;
  }
}
