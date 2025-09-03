import {
  CreateCustomerProps,
  createCustomerSchema,
  CustomerProps,
  CustomerSchema,
} from "../../interfaces/customer";
import { generateEntityID } from "../../utils/generate-id";
import { BadRequestError } from "../errors/shared";

export class Customer {
  private props: CustomerProps;

  private constructor(props: CustomerProps) {
    this.props = props;
  }

  static create(props: CreateCustomerProps) {
    const result = createCustomerSchema.safeParse(props);
    const arePropsValid = result.success;

    if (!arePropsValid)
      throw new BadRequestError("Invalid customer creation props");

    return new Customer({
      id: generateEntityID(),
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
    });
  }

  static from(props: CustomerProps) {
    const result = CustomerSchema.safeParse(props);
    const arePropsValid = result.success;

    if (!arePropsValid)
      throw new BadRequestError("Invalid customer restore props");

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
