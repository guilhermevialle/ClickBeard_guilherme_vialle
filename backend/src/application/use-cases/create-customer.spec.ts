import { beforeEach, describe, expect, it, vi } from "vitest";
import { Customer } from "../../domain/entities/customer";
import { ICustomerRepository } from "../../infra/interfaces/customer-repository.interface";
import { CreateCustomerDto } from "../dtos/create-customer";
import { UserAlreadyExistsError } from "../errors/shared";
import { CreateCustomer } from "./create-customer";

describe("CreateCustomer Use Case", () => {
  let customerRepoMock: ICustomerRepository;
  let createCustomer: CreateCustomer;

  const mockCustomerData: CreateCustomerDto = {
    email: "test@example.com",
    name: "Test User",
    password: "securepassword",
  };

  beforeEach(() => {
    customerRepoMock = {
      findByEmail: vi.fn(),
      save: vi.fn(),
    } as unknown as ICustomerRepository;
    createCustomer = new CreateCustomer(customerRepoMock);
  });

  it("should create a new customer when email does not exist", async () => {
    (customerRepoMock.findByEmail as any).mockResolvedValue(null);
    (customerRepoMock.save as any).mockResolvedValue(undefined);

    const customer = await createCustomer.execute(mockCustomerData);

    expect(customer).toBeInstanceOf(Customer);
    expect(customer.email).toBe(mockCustomerData.email);
    expect(customer.name).toBe(mockCustomerData.name);
    expect(customer.password).toBe(mockCustomerData.password);

    expect(customerRepoMock.findByEmail).toHaveBeenCalledWith(
      mockCustomerData.email
    );
    expect(customerRepoMock.save).toHaveBeenCalledWith(customer);
  });

  it("should throw UserAlreadyExistsError if email already exists", async () => {
    (customerRepoMock.findByEmail as any).mockResolvedValue(
      Customer.create(mockCustomerData)
    );

    await expect(
      createCustomer.execute(mockCustomerData)
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);

    expect(customerRepoMock.findByEmail).toHaveBeenCalledWith(
      mockCustomerData.email
    );
    expect(customerRepoMock.save).not.toHaveBeenCalled();
  });
});
