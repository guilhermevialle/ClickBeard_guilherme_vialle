import z from "zod";

export const idSchema = (name?: string) => z.string("ID must be a string");
