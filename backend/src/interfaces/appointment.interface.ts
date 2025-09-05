import { isAfter } from "date-fns";
import z from "zod";
import { idSchema } from "../utils/id-schema";

// props obrigatorios
export const createAppointmentSchema = z.object({
  customerId: idSchema("customerId"),
  barberId: idSchema("barberId"),
  specialtyId: idSchema("specialtyId"),
  durationInMinutes: z
    .number("Duration must be a number")
    .int("Duration must be an integer")
    .positive("Duration must be greater than 0"),
  startAt: z.coerce
    .date("StartAt must be a valid date")
    .refine((date) => isAfter(date, new Date()), {
      message: "StartAt must be in the future",
    }),
});

// pode adicionar mais props nao necessarias para o create
export const partialAppointmentSchema = z.object({
  id: idSchema().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  status: z
    .enum(["CONFIRMED", "CANCELLED", "COMPLETED"])
    .default("CONFIRMED")
    .optional(),
});

// juntando tudo
export const appointmentSchema = createAppointmentSchema.merge(
  partialAppointmentSchema.required()
);

export type CreateAppointmentProps = z.infer<typeof createAppointmentSchema>;
export type PartialAppointmentProps = z.infer<typeof partialAppointmentSchema>;
export type AppointmentProps = z.infer<typeof appointmentSchema>;
