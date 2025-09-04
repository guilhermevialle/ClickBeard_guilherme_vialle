import {
  CreateSpecialtyProps,
  createSpecialtySchema,
  SpecialtyProps,
  specialtySchema,
} from "../../interfaces/specialty.interface";
import { generateEntityID } from "../../utils/generate-id";
import { InvalidInputError } from "../errors/shared";

export class Specialty {
  private props: SpecialtyProps;

  private constructor(props: SpecialtyProps) {
    this.props = props;
  }

  static create(props: CreateSpecialtyProps) {
    const result = createSpecialtySchema.safeParse(props);
    if (!result.success) throw new InvalidInputError(result.error.message);

    return new Specialty({
      id: generateEntityID(),
      name: result.data.name,
      durationInMinutes: result.data.durationInMinutes,
    });
  }

  static from(props: SpecialtyProps) {
    const result = specialtySchema.safeParse(props);
    if (!result.success) throw new InvalidInputError(result.error.message);

    return new Specialty({
      id: result.data.id,
      name: result.data.name,
      durationInMinutes: result.data.durationInMinutes,
    });
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      durationInMinutes: this.durationInMinutes,
    };
  }

  // getters
  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get durationInMinutes() {
    return this.props.durationInMinutes;
  }
}
