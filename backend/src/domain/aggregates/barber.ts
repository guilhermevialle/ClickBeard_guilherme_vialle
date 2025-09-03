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

  private updateWorkday(workday: BarberWorkday) {
    const index = this.props.workdays.findIndex(
      (wd) => wd.weekday === workday.weekday
    );

    this.props.workdays[index] = workday;
  }

  // public methods
  public addWorkday(workday: BarberWorkday) {
    if (this.isWorkingAtDay(workday.weekday))
      return this.updateWorkday(workday);

    this.props.workdays.push(workday);
  }

  public removeWorkday(workdayId: string) {
    this.props.workdays = this.props.workdays.filter(
      (wd) => wd.id !== workdayId
    );
  }

  public isWorkingAtDay(weekday: number) {
    return this.props.workdays.some((wd) => wd.weekday === weekday);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      hiredAt: this.hiredAt,
      workdays: this.workdays.map((wd) => wd.toJSON()),
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
