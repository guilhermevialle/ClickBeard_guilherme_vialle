import { Customer } from "../../domain/entities/customer";

export interface ICustomerRepository {
  save(customer: Customer): Promise<void>;
  findByEmail(email: string): Promise<Customer | null>;
  findById(id: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
}
