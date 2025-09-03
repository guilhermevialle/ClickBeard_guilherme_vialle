import {
  BarberWorkdayProps,
  barberWorkdaySchema,
  CreateBarberWorkdayProps,
  createBarberWorkdaySchema,
} from "../../interfaces/barber-workday.interface";
import { generateEntityID } from "../../utils/generate-id";
import { InvalidInputError } from "../errors/shared";

export class BarberWorkday {
  private props: BarberWorkdayProps;

  constructor(props: BarberWorkdayProps) {
    this.props = props;
  }

  // static methods
  static create(props: CreateBarberWorkdayProps) {
    const result = createBarberWorkdaySchema.safeParse(props);
    if (!result.success) throw new InvalidInputError(result.error.message);

    return new BarberWorkday({
      id: generateEntityID(),
      barberId: result.data.barberId,
      weekday: result.data.weekday,
    });
  }

  static from(props: BarberWorkdayProps) {
    const result = barberWorkdaySchema.safeParse(props);
    if (!result.success) throw new InvalidInputError(result.error.message);

    return new BarberWorkday({
      id: result.data.id,
      barberId: result.data.barberId,
      weekday: result.data.weekday,
    });
  }

  // getters
  get id() {
    return this.props.id;
  }
  get barberId() {
    return this.props.barberId;
  }
  get weekday() {
    return this.props.weekday;
  }
}
