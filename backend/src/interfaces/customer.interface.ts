import z from "zod";
import { idSchema } from "../utils/id-schema";

// aqui temos os campos obrigatorios para criacao
export const createCustomerSchema = z.object({
  name: z
    .string("Name must be a string")
    .min(1, "Name must have at least 1 character"),
  email: z.email("Email must be a valid email").min(1, "Email is required"),
  password: z
    .string("Password must be a string")
    .min(1, "Password is required"),
});

// aqui poderiamos adicionar createdAt e updatedAt por exemplo
export const partialCustomerSchema = z.object({
  id: idSchema().optional(),
});

// juntamos tudo como required para ser a definicao final de Customer
export const CustomerSchema = createCustomerSchema.merge(
  partialCustomerSchema.required()
);

export type CustomerProps = z.infer<typeof CustomerSchema>;
export type PartialCustomerProps = z.infer<typeof partialCustomerSchema>;
export type CreateCustomerProps = z.infer<typeof createCustomerSchema>;
