import z from "zod";

export const createAppointmentSchema = z.object({
  barberId: z.string("BarberId must be a string"),
  customerId: z.string("CustomerId must be a string"),
});
