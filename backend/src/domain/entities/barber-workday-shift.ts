import {
  BarberWorkdayShiftProps,
  barberWorkdayShiftSchema,
  CreateBarberWorkdayShiftProps,
  createBarberWorkdayShiftSchema,
} from "../../interfaces/barber-workday-shift.interface";
import { generateEntityID } from "../../utils/generate-id";
import { InvalidInputError } from "../errors/shared";

export class BarberWorkdayShift {
  private props: BarberWorkdayShiftProps;

  constructor(props: BarberWorkdayShiftProps) {
    this.props = props;
    this.nextValidation();
  }

  // private methods
  private nextValidation() {
    if (this.props.startAtInMinutes > this.props.endAtInMinutes)
      throw new InvalidInputError("startAt must be less than endAt");
  }

  // static methods
  static create(props: CreateBarberWorkdayShiftProps) {
    const result = createBarberWorkdayShiftSchema.safeParse(props);
    if (!result.success) throw new InvalidInputError(result.error.message);

    return new BarberWorkdayShift({
      id: generateEntityID(),
      workdayId: result.data.workdayId,
      startAtInMinutes: result.data.startAtInMinutes,
      endAtInMinutes: result.data.endAtInMinutes,
    });
  }

  static from(props: BarberWorkdayShiftProps) {
    const result = barberWorkdayShiftSchema.safeParse(props);
    if (!result.success) throw new InvalidInputError(result.error.message);

    return new BarberWorkdayShift({
      id: result.data.id,
      workdayId: result.data.workdayId,
      startAtInMinutes: result.data.startAtInMinutes,
      endAtInMinutes: result.data.endAtInMinutes,
    });
  }

  // getters
  get id() {
    return this.props.id;
  }
  get workdayId() {
    return this.props.workdayId;
  }
  get startAtInMinutes() {
    return this.props.startAtInMinutes;
  }
  get endAtInMinutes() {
    return this.props.endAtInMinutes;
  }
}
