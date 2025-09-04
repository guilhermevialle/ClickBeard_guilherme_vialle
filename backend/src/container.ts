import { container } from "tsyringe";
import { IAuthService } from "./infra/interfaces/auth-service.interface";
import { ICustomerRepository } from "./infra/interfaces/customer-repository.interface";
import { IHashService } from "./infra/interfaces/hash-service.interface";
import { InMemoryCustomerRepository } from "./infra/repositories/in-memory/customer.repository";
import { AuthService } from "./infra/services/auth.service";
import { BcryptHashService } from "./infra/services/bcrypt-hash.service";
import {
  ITokenService,
  JwtTokenService,
} from "./infra/services/jwt-token.service";

const ACCESS_TOKEN_SECRET =
  process.env.TOKEN_SECRET ?? "secret_for_education_purposes";
const REFRESH_TOKEN_SECRET =
  process.env.TOKEN_SECRET ?? "secret_for_education_purposes";

const accessTokenService = new JwtTokenService(ACCESS_TOKEN_SECRET, 3600);
const refreshTokenService = new JwtTokenService(REFRESH_TOKEN_SECRET, 86400);

container.registerInstance<ITokenService>(
  "AccessTokenService",
  accessTokenService
);
container.registerInstance<ITokenService>(
  "RefreshTokenService",
  refreshTokenService
);
container.registerSingleton<IHashService>("HashService", BcryptHashService);
container.registerSingleton<IAuthService>("AuthService", AuthService);
container.registerSingleton<ICustomerRepository>(
  "CustomerRepository",
  InMemoryCustomerRepository
);
