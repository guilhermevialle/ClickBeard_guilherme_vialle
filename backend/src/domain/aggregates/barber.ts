import {
  BarberProps,
  barberSchema,
  CreateBarberProps,
  createBarberSchema,
} from "../../interfaces/barber.interface";
import { generateEntityID } from "../../utils/generate-id";
import { BarberWorkday } from "../entities/barber-workday";
import { InvalidInputError } from "../errors/shared";

export class Barber {
  private props: BarberProps;

  private constructor(props: BarberProps) {
    this.props = props;
  }

  // static methods
  static create(props: CreateBarberProps) {
    const result = createBarberSchema.safeParse(props);
    if (!result.success) throw new InvalidInputError(result.error.message);

    return new Barber({
      id: generateEntityID(),
      name: result.data.name,
      age: result.data.age,
      hiredAt: result.data.hiredAt,
      workdays: [],
    });
  }

  static from(props: BarberProps) {
    const result = barberSchema.safeParse(props);
    if (!result.success) throw new InvalidInputError(result.error.message);

    return new Barber({
      id: result.data.id,
      name: result.data.name,
      age: result.data.age,
      hiredAt: result.data.hiredAt,
      workdays: result.data.workdays,
    });
  }

  public addWorkdayWithShifts(
    day: number,
    shifts: Array<{
      startAtInMinutes: number;
      endAtInMinutes: number;
    }>
  ) {
    const wd = BarberWorkday.create({
      barberId: this.props.id,
      weekday: day,
    });

    wd.addShifts(shifts);
    this.props.workdays.push(wd);
  }

  removeWorkday(day: number) {
    this.props.workdays = this.props.workdays.filter(
      (wd) => wd.weekday !== day
    );
  }

  public isWorkingAtDay(day: number) {
    return this.props.workdays.some((wd) => wd.weekday === day);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      hiredAt: this.hiredAt,
      workdays: this.workdays.map((wd) => wd.toJSON())!,
    };
  }

  // props getters
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
  get workdays() {
    return this.props.workdays;
  }
}
