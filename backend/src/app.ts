import "dotenv/config";
import "reflect-metadata";
import "./container";
import { authRoutes } from "./infra/http/routes/auth";

import fastify = require("fastify");

export const app = fastify();

authRoutes(app);
