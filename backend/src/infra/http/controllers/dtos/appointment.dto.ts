import { isAfter } from "date-fns";
import z from "zod";
import { idSchema } from "../../../../utils/id-schema";

export const createAppointmentSchemaDto = z.object({
  barberId: idSchema("barberId"),
  specialtyId: idSchema("specialtyId"),
  startAt: z.coerce.date("StartAt must be a valid date").refine((date) => {
    return isAfter(date, new Date());
  }, "StartAt must be in the future"),
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchemaDto>;
