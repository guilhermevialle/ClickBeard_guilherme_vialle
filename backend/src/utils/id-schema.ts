import z from "zod";

export const idSchema = (name: string = "id") =>
  z
    .string(`${name} must be a string`)
    .min(1, `${name} must have at least 1 character`);
