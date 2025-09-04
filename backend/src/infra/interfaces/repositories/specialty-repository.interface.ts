import { Specialty } from "../../../domain/entities/specialty";

export interface ISpecialtyRepository {
  save(specialty: Specialty): Promise<void>;
  findById(id: string): Promise<Specialty | null>;
  findByName(name: string): Promise<Specialty | null>;
  findAll(): Promise<Specialty[]>;
}
