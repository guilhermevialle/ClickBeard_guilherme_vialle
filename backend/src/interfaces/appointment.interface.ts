import z from "zod";
import { idSchema } from "../utils/id-schema";

// props obrigatorios
export const createAppointmentSchema = z.object({
  customerId: idSchema("customerId"),
  barberId: idSchema("barberId"),
  specialtyId: idSchema("specialtyId"),
});

// pode adicionar mais props nao necessarias para o create
export const partialAppointmentSchema = z.object({
  id: idSchema().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// juntando tudo
export const appointmentSchema = createAppointmentSchema.merge(
  partialAppointmentSchema.required()
);

export type CreateAppointmentProps = z.infer<typeof createAppointmentSchema>;
export type PartialAppointmentProps = z.infer<typeof partialAppointmentSchema>;
export type AppointmentProps = z.infer<typeof appointmentSchema>;
