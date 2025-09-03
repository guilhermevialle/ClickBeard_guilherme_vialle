import {
  CreateCustomerProps,
  createCustomerSchema,
  CustomerProps,
  CustomerSchema,
} from "../../interfaces/customer.interface";
import { generateEntityID } from "../../utils/generate-id";
import { InvalidInputError } from "../errors/shared";

export class Customer {
  private props: CustomerProps;

  private constructor(props: CustomerProps) {
    this.props = props;
  }

  static create(props: CreateCustomerProps) {
    const result = createCustomerSchema.safeParse(props);

    if (!result.success)
      throw new InvalidInputError("Invalid customer creation props");

    return new Customer({
      id: generateEntityID(),
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
    });
  }

  static from(props: CustomerProps) {
    const result = CustomerSchema.safeParse(props);

    if (!result.success)
      throw new InvalidInputError("Invalid customer restore props");

    return new Customer({
      id: result.data.id,
      email: result.data.email,
      name: result.data.name,
      password: result.data.password,
    });
  }

  // getters
  get id() {
    return this.props.id;
  }
  get email() {
    return this.props.email;
  }
  get name() {
    return this.props.name;
  }
  get password() {
    return this.props.password;
  }
}
