import z from "zod";
import { idSchema } from "../utils/id-schema";

export const createSpecialtySchema = z.object({
  name: z
    .string("Name must be a string")
    .min(1, "Name must have at least 1 character"),
});

export const partialSpecialtySchema = z.object({
  id: idSchema().optional(),
});

export const specialtySchema = createSpecialtySchema.merge(
  partialSpecialtySchema.required()
);

export type CreateSpecialtyProps = z.infer<typeof createSpecialtySchema>;
export type PartialSpecialtyProps = z.infer<typeof partialSpecialtySchema>;
export type SpecialtyProps = z.infer<typeof specialtySchema>;
