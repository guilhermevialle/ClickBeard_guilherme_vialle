import {
  BarberProps,
  barberSchema,
  CreateBarberProps,
  createBarberSchema,
} from "../../interfaces/barber.interface";
import { generateEntityID } from "../../utils/generate-id";
import { BadRequestError } from "../errors/shared";

export class Barber {
  private props: BarberProps;

  private constructor(props: BarberProps) {
    this.props = props;
  }

  static create(props: CreateBarberProps) {
    const result = createBarberSchema.safeParse(props);
    if (!result.success)
      throw new BadRequestError("Invalid barber creation props");

    return new Barber({
      id: generateEntityID(),
      name: result.data.name,
      age: result.data.age,
      hiredAt: result.data.hiredAt,
    });
  }

  static from(props: BarberProps) {
    const result = barberSchema.safeParse(props);
    if (!result.success)
      throw new BadRequestError("Invalid barber restore props");

    return new Barber({
      id: result.data.id,
      name: result.data.name,
      age: result.data.age,
      hiredAt: result.data.hiredAt,
    });
  }

  // getters
  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get age() {
    return this.props.age;
  }
  get hiredAt() {
    return this.props.hiredAt;
  }
}
