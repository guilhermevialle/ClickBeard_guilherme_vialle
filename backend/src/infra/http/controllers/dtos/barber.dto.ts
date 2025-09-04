import z from "zod";
import { idSchema } from "../../../../utils/id-schema";

export const getBarberSlotsByDateSchemaDto = z.object({
  barberId: idSchema(`barberId`),
  date: z.coerce.date(`Date must be a valid date`),
});

export type GetBarberSlotsByDateSchemaDto = z.TypeOf<
  typeof getBarberSlotsByDateSchemaDto
>;
