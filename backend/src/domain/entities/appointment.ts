import {
  addMinutes,
  areIntervalsOverlapping,
  differenceInMinutes,
} from "date-fns";
import {
  AppointmentProps,
  appointmentSchema,
  CreateAppointmentProps,
  createAppointmentSchema,
} from "../../interfaces/appointment.interface";
import { generateEntityID } from "../../utils/generate-id";
import {
  AppointmentAlreadyCompletedError,
  CannotCancelAppointmentError,
  InvalidInputError,
} from "../errors/shared";

export class Appointment {
  private props: AppointmentProps;

  private constructor(props: AppointmentProps) {
    this.props = props;
  }

  static create(props: CreateAppointmentProps) {
    const result = createAppointmentSchema.safeParse(props);
    if (!result.success) {
      throw new InvalidInputError(result.error.message);
    }

    return new Appointment({
      id: generateEntityID(),
      customerId: result.data.customerId,
      barberId: result.data.barberId,
      specialtyId: result.data.specialtyId,
      durationInMinutes: result.data.durationInMinutes,
      startAt: result.data.startAt,
      status: "CONFIRMED",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static from(props: AppointmentProps): Appointment {
    const result = appointmentSchema.safeParse(props);

    if (!result.success) {
      throw new InvalidInputError(result.error.message);
    }

    return new Appointment({
      id: result.data.id,
      customerId: result.data.customerId,
      barberId: result.data.barberId,
      specialtyId: result.data.specialtyId,
      durationInMinutes: result.data.durationInMinutes,
      status: result.data.status,
      startAt: result.data.startAt,
      createdAt: result.data.createdAt,
      updatedAt: result.data.updatedAt,
    });
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  // private methods
  private updateStatus(status: "CONFIRMED" | "CANCELLED" | "COMPLETED") {
    this.props.status = status;
    this.touch();
  }

  // public methods
  public isOverlapping(
    range: { startAt: Date; endAt: Date },
    inclusive: boolean = false
  ): boolean {
    const thisRange = {
      start: this.startAt,
      end: addMinutes(this.startAt, this.durationInMinutes),
    };

    const otherRange = {
      start: range.startAt,
      end: range.endAt,
    };

    return areIntervalsOverlapping(otherRange, thisRange, { inclusive });
  }

  public cancel() {
    const now = new Date();

    if (this.wasFinished)
      throw new AppointmentAlreadyCompletedError(
        `Appointment with id ${this.id} already completed.`
      );

    const minutesRemaining = differenceInMinutes(this.startAt, now);

    if (minutesRemaining < 120) {
      throw new CannotCancelAppointmentError(
        "Cannot cancel an appointment less than 2 hours before it starts."
      );
    }

    this.updateStatus("CANCELLED");
  }

  public toJSON() {
    return {
      id: this.id,
      customerId: this.customerId,
      barberId: this.barberId,
      specialtyId: this.specialtyId,
      durationInMinutes: this.durationInMinutes,
      status: this.status,
      startAt: this.startAt,
      endAt: this.endAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // getters
  get id() {
    return this.props.id;
  }
  get customerId() {
    return this.props.customerId;
  }
  get status() {
    return this.props.status;
  }
  get barberId() {
    return this.props.barberId;
  }
  get specialtyId() {
    return this.props.specialtyId;
  }
  get durationInMinutes() {
    return this.props.durationInMinutes;
  }
  get startAt() {
    return this.props.startAt;
  }
  get endAt() {
    return addMinutes(this.startAt, this.durationInMinutes);
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get wasFinished() {
    return this.endAt < new Date();
  }
}
