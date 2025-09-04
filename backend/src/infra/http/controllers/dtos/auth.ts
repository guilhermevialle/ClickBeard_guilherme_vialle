import z from "zod";

export const authLoginSchemaDto = z.object({
  email: z.email("Email must be a valid email").min(1, "Email is required"),
  password: z
    .string("Password must be a string")
    .min(1, "Password is required"),
});

export const authRegisterSchemaDto = z.object({
  name: z
    .string("Name must be a string")
    .min(1, "Name must have at least 1 character"),
  email: z.email("Email must be a valid email").min(1, "Email is required"),
  password: z
    .string("Password must be a string")
    .min(1, "Password is required"),
});
