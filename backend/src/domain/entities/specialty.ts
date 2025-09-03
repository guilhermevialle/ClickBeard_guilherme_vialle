import {
  CreateSpecialtyProps,
  createSpecialtySchema,
  SpecialtyProps,
  specialtySchema,
} from "../../interfaces/specialty.interface";
import { generateEntityID } from "../../utils/generate-id";
import { BadRequestError } from "../errors/shared";

export class Specialty {
  private props: SpecialtyProps;

  private constructor(props: SpecialtyProps) {
    this.props = props;
  }

  static create(props: CreateSpecialtyProps) {
    const result = createSpecialtySchema.safeParse(props);
    if (!result.success)
      throw new BadRequestError("Invalid specialty creation props");

    return new Specialty({
      id: generateEntityID(),
      name: result.data.name,
    });
  }

  static from(props: SpecialtyProps) {
    const result = specialtySchema.safeParse(props);
    if (!result.success)
      throw new BadRequestError("Invalid specialty restore props");

    return new Specialty({
      id: result.data.id,
      name: result.data.name,
    });
  }

  // getters
  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }
}
