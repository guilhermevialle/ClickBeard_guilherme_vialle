import z from "zod";
import { idSchema } from "../utils/id-schema";

export const createBarberWorkdayShiftSchema = z.object({
  workdayId: idSchema("workdayId"),
  startAtInMinutes: z
    .number("StartAt must be a number")
    .int("StartAt must be an integer")
    .min(0, "StartAt must be at least 0 minutes")
    .max(1440, "StartAt must be less than 1440 minutes"),
  endAtInMinutes: z
    .number("EndAt must be a number")
    .int("EndAt must be an integer")
    .min(0, "EndAt must be at least 0 minutes")
    .max(1440, "EndAt must be less than 1440 minutes"),
});

export const partialWorkdayShiftSchema = z.object({
  id: idSchema().optional(),
});

export const barberWorkdayShiftSchema = createBarberWorkdayShiftSchema.merge(
  partialWorkdayShiftSchema.required()
);

export type BarberWorkdayShiftProps = z.infer<typeof barberWorkdayShiftSchema>;
export type PartialWorkdayShiftProps = z.infer<
  typeof partialWorkdayShiftSchema
>;

export type CreateBarberWorkdayShiftProps = z.infer<
  typeof createBarberWorkdayShiftSchema
>;
