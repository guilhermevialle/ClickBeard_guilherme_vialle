import { z } from "zod";
import { idSchema } from "../utils/id-schema";

// props obrigatorios
export const createBarberSpecialtySchema = z.object({
  barberId: idSchema(),
  specialtyId: idSchema(),
});

// pode adicionar mais props nao necessarias para o create
export const partialBarberSpecialtySchema = z.object({
  id: idSchema().optional(),
});

export const barberSpecialtySchema = createBarberSpecialtySchema.merge(
  partialBarberSpecialtySchema.required()
);

export type CreateBarberSpecialtyProps = z.infer<
  typeof createBarberSpecialtySchema
>;
export type PartialBarberSpecialtyProps = z.infer<
  typeof partialBarberSpecialtySchema
>;
export type BarberSpecialtyProps = z.infer<typeof barberSpecialtySchema>;
