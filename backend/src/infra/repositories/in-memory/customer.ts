import { Customer } from "../../../domain/entities/customer";
import { ICustomerRepository } from "../../interfaces/customer-repository.interface";

export class InMemoryCustomerRepository implements ICustomerRepository {
  private customers: Customer[] = [];

  async save(customer: Customer): Promise<void> {
    this.customers.push(customer);
  }
  async findById(id: string): Promise<Customer | null> {
    return this.customers.find((customer) => customer.id === id) ?? null;
  }
  async findByEmail(email: string): Promise<Customer | null> {
    return this.customers.find((customer) => customer.email === email) ?? null;
  }
  async findAll(): Promise<Customer[]> {
    return this.customers;
  }
}
