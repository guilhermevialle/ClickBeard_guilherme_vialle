import { Customer } from "../../domain/entities/customer";
import { ICustomerRepository } from "../../infra/interfaces/customer-repository.interface";
import { CreateCustomerDto } from "../dtos/create-customer";
import { UserAlreadyExistsError } from "../errors/shared";

export class CreateCustomer {
  constructor(private readonly customerRepo: ICustomerRepository) {}

  async execute({
    email,
    name,
    password,
  }: CreateCustomerDto): Promise<Customer> {
    const userExists = await this.customerRepo.findByEmail(email);

    if (userExists)
      throw new UserAlreadyExistsError(
        `User with email ${email} already exists`
      );

    const customer = Customer.create({ email, name, password });

    await this.customerRepo.save(customer);

    return customer;
  }
}
