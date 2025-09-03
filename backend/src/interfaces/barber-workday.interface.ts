import z from "zod";
import { BarberWorkdayShift } from "../domain/entities/barber-workday-shift";
import { idSchema } from "../utils/id-schema";

export const createBarberWorkdaySchema = z.object({
  barberId: idSchema("barberId"),
  weekday: z
    .number("Weekday must be a number")
    .int("Weekday must be an integer")
    .min(0, "Weekday must be between 0 (Sunday) and 6 (Saturday)")
    .max(6, "Weekday must be between 0 (Sunday) and 6 (Saturday)"),
});

export const optionalBarberWorkdaySchema = z.object({
  id: idSchema().optional(),
  shifts: z.array(z.instanceof(BarberWorkdayShift)).optional(),
});

export const barberWorkdaySchema = createBarberWorkdaySchema.merge(
  optionalBarberWorkdaySchema.required()
);

export type BarberWorkdayProps = z.infer<typeof barberWorkdaySchema>;
export type CreateBarberWorkdayProps = z.infer<
  typeof createBarberWorkdaySchema
>;
export type PartialBarberWorkdayProps = z.infer<
  typeof optionalBarberWorkdaySchema
>;
