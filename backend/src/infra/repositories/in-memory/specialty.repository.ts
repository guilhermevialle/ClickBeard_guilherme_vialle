import { Specialty } from "../../../domain/entities/specialty";
import { ISpecialtyRepository } from "../../interfaces/repositories/specialty-repository";

export class InMemorySpecialtyRepository implements ISpecialtyRepository {
  private specialties: Specialty[] = [
    Specialty.create({
      name: "Haircut",
      durationInMinutes: 30,
    }),
    Specialty.create({
      name: "Shave",
      durationInMinutes: 30,
    }),
  ];

  async save(specialty: Specialty): Promise<void> {
    this.specialties.push(specialty);
  }

  async findById(id: string): Promise<Specialty | null> {
    return this.specialties.find((specialty) => specialty.id === id) ?? null;
  }

  async findByName(name: string): Promise<Specialty | null> {
    return (
      this.specialties.find((specialty) => specialty.name === name) ?? null
    );
  }

  async findAll(): Promise<Specialty[]> {
    return [...this.specialties];
  }
}
