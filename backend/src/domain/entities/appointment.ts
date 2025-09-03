import {
  AppointmentProps,
  appointmentSchema,
  CreateAppointmentProps,
  createAppointmentSchema,
} from "../../interfaces/appointment.interface";
import { generateEntityID } from "../../utils/generate-id";
import { InvalidInputError } from "../errors/shared";

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
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static from(props: AppointmentProps) {
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
      startAt: result.data.startAt,
      createdAt: result.data.createdAt,
      updatedAt: result.data.updatedAt,
    });
  }

  // getters
  get id() {
    return this.props.id;
  }
  get customerId() {
    return this.props.customerId;
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
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
