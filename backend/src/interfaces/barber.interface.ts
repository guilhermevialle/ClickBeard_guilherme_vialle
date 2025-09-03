import z from "zod";
import { idSchema } from "../utils/id-schema";

// campos obrigatórios para criacao
export const createBarberSchema = z.object({
  name: z
    .string("Name must be a string")
    .min(1, "Name must have at least 1 character"),
  age: z
    .number("Age must be a number")
    .int("Age must be an integer")
    .positive("Age must be greater than 0"),
  hiredAt: z.coerce.date("HiredAt must be a valid date"),
});

// campos opcionais
export const partialBarberSchema = z.object({
  id: idSchema().optional(),
});

// schema final para entidade
export const barberSchema = createBarberSchema.merge(
  partialBarberSchema.required()
);

export type BarberProps = z.infer<typeof barberSchema>;
export type PartialBarberProps = z.infer<typeof partialBarberSchema>;
export type CreateBarberProps = z.infer<typeof createBarberSchema>;
