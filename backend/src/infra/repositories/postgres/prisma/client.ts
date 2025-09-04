import { PrismaClient } from "../../../../generated/prisma";

export const prismaClient = new PrismaClient();
export type PrismaClientType = typeof prismaClient;
