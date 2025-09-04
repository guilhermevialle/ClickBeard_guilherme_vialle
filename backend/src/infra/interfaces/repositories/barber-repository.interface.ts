import { Barber } from "../../../domain/aggregates/barber";

export interface IBarberRepository {
  save(barber: Barber): Promise<void>;
  findByName(name: string): Promise<Barber | null>;
  findById(id: string): Promise<Barber | null>;
  findAll(): Promise<Barber[]>;
}
