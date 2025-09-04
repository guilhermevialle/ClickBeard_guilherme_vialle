import {
  BarberSpecialtyProps,
  barberSpecialtySchema,
  CreateBarberSpecialtyProps,
  createBarberSpecialtySchema,
} from "../../interfaces/barber-specialty.interface";
import { generateEntityID } from "../../utils/generate-id";
import { InvalidInputError } from "../errors/shared";

export class BarberSpecialty {
  private props: BarberSpecialtyProps;

  private constructor(props: BarberSpecialtyProps) {
    this.props = props;
  }

  static create(props: CreateBarberSpecialtyProps) {
    const result = createBarberSpecialtySchema.safeParse(props);
    if (!result.success) {
      throw new InvalidInputError(result.error.message);
    }

    return new BarberSpecialty({
      id: generateEntityID(),
      barberId: result.data.barberId,
      specialtyId: result.data.specialtyId,
    });
  }

  static from(props: BarberSpecialtyProps) {
    const result = barberSpecialtySchema.safeParse(props);
    if (!result.success) {
      throw new InvalidInputError(result.error.message);
    }

    return new BarberSpecialty({
      id: result.data.id,
      barberId: result.data.barberId,
      specialtyId: result.data.specialtyId,
    });
  }

  public toJSON() {
    return {
      id: this.id,
      barberId: this.barberId,
      specialtyId: this.specialtyId,
    };
  }

  get id() {
    return this.props.id;
  }

  get barberId() {
    return this.props.barberId;
  }

  get specialtyId() {
    return this.props.specialtyId;
  }
}
