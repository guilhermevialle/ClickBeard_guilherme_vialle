import {
  BarberWorkdayProps,
  barberWorkdaySchema,
  CreateBarberWorkdayProps,
  createBarberWorkdaySchema,
} from "../../interfaces/barber-workday.interface";
import { generateEntityID } from "../../utils/generate-id";
import { InvalidInputError } from "../errors/shared";
import { BarberWorkdayShift } from "./barber-workday-shift";

export class BarberWorkday {
  private props: BarberWorkdayProps;

  constructor(props: BarberWorkdayProps) {
    this.props = props;
  }

  static create(props: CreateBarberWorkdayProps) {
    const result = createBarberWorkdaySchema.safeParse(props);
    if (!result.success) throw new InvalidInputError(result.error.message);

    return new BarberWorkday({
      id: generateEntityID(),
      barberId: result.data.barberId,
      weekday: result.data.weekday,
      shifts: [],
    });
  }

  static from(props: BarberWorkdayProps) {
    const result = barberWorkdaySchema.safeParse(props);
    if (!result.success) throw new InvalidInputError(result.error.message);

    return new BarberWorkday({
      id: result.data.id,
      barberId: result.data.barberId,
      weekday: result.data.weekday,
      shifts: result.data.shifts,
    });
  }

  public addShift(shift: BarberWorkdayShift) {
    this.props.shifts.push(shift);
  }

  public toJSON() {
    return {
      id: this.id,
      barberId: this.barberId,
      weekday: this.weekday,
      shifts: this.shifts.map((s) => s.toJSON()),
    };
  }

  get id() {
    return this.props.id;
  }
  get shifts() {
    return this.props.shifts;
  }
  get barberId() {
    return this.props.barberId;
  }
  get weekday() {
    return this.props.weekday;
  }
}
