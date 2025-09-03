import { describe, expect, it } from "vitest";
import { BadRequestError } from "../errors/shared";
import { Customer } from "./customer";

describe("Customer Entity", () => {
  it("should create a customer properly", () => {
    const customer = Customer.create({
      name: "any_name",
      email: "email@email.com",
      password: "any_password",
    });

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("any_name");
    expect(customer.email).toBe("email@email.com");
    expect(customer.password).toBe("any_password");
  });

  it("should restore a customer properly", () => {
    const customer = Customer.from({
      id: "any_id",
      name: "any_name",
      email: "email@email.com",
      password: "any_password",
    });

    expect(customer.id).toBe("any_id");
    expect(customer.name).toBe("any_name");
    expect(customer.email).toBe("email@email.com");
    expect(customer.password).toBe("any_password");
  });

  it("should throw BadRequestError when creating with invalid props", () => {
    expect(() =>
      Customer.create({
        name: "",
        email: "not-an-email",
        password: "",
      } as any)
    ).toThrow(BadRequestError);
  });

  it("should throw BadRequestError when restoring with invalid props", () => {
    expect(() =>
      Customer.from({
        id: "",
        name: "",
        email: "not-an-email",
        password: "",
      } as any)
    ).toThrow(BadRequestError);
  });

  it("should throw BadRequestError when restoring without id", () => {
    expect(() =>
      Customer.from({
        name: "any_name",
        email: "email@email.com",
        password: "any_password",
      } as any)
    ).toThrow(BadRequestError);
  });
});
