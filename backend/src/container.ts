import { container } from "tsyringe";
import { IAuthService } from "./infra/interfaces/auth-service.interface";
import { ICustomerRepository } from "./infra/interfaces/customer-repository.interface";
import { IHashService } from "./infra/interfaces/hash-service.interface";
import { InMemoryCustomerRepository } from "./infra/repositories/in-memory/customer";
import { AuthService } from "./infra/services/auth.service";
import { BcryptHashService } from "./infra/services/bcrypt-hash.service";
import {
  ITokenService,
  JwtTokenService,
} from "./infra/services/jwt-token.service";

const TOKEN_SECRET = process.env.TOKEN_SECRET ?? "just_for_education_purposes";

const tokenService = new JwtTokenService(TOKEN_SECRET);
container.registerInstance<ITokenService>("TokenService", tokenService);
container.registerSingleton<IHashService>("HashService", BcryptHashService);
container.registerSingleton<IAuthService>("AuthService", AuthService);
container.registerSingleton<ICustomerRepository>(
  "CustomerRepository",
  InMemoryCustomerRepository
);
