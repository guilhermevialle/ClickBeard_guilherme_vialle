import { inject, injectable } from "tsyringe";
import { Customer } from "../../../domain/entities/customer";
import { ICustomerRepository } from "../../interfaces/repositories/customer-repository.interface";
import type { PrismaClientType } from "./prisma/client";

@injectable()
export class PostgresPrismaCustomerRepository implements ICustomerRepository {
  constructor(@inject("PrismaClient") private prisma: PrismaClientType) {}

  async findAll(): Promise<Customer[]> {
    const customers = await this.prisma.customer.findMany();

    return customers.map((customer) =>
      Customer.from({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        password: customer.password,
      })
    );
  }

  async save(customer: Customer): Promise<void> {
    await this.prisma.customer.create({
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        password: customer.password,
      },
    });
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) return null;

    return Customer.from({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      password: customer.password,
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) return null;

    return Customer.from({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      password: customer.password,
    });
  }
}
