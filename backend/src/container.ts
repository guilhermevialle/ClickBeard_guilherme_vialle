import { container } from "tsyringe";
import { CreateBarberWithSpecialties } from "./application/use-cases/create-barber-with-specialties";
import { CreateSpecialty } from "./application/use-cases/create-specialty";
import { GetAllBarberSpecialty } from "./application/use-cases/get-all-barber-specialty";
import { GetAllSpecialties } from "./application/use-cases/get-all-specialties";
import { IBarberRepository } from "./infra/interfaces/repositories/barber-repository.interface";
import { IBarberSpecialtyRepository } from "./infra/interfaces/repositories/barber-specialty-repository.interface";
import { ICustomerRepository } from "./infra/interfaces/repositories/customer-repository.interface";
import { ISpecialtyRepository } from "./infra/interfaces/repositories/specialty-repository";
import type { IAuthService } from "./infra/interfaces/services/auth-service.interface";
import type { IHashService } from "./infra/interfaces/services/hash-service.interface";
import { InMemoryBarberSpecialtyRepository } from "./infra/repositories/in-memory/barber-specialty.repository";
import { InMemoryBarberRepository } from "./infra/repositories/in-memory/barber.repository";
import { InMemoryCustomerRepository } from "./infra/repositories/in-memory/customer.repository";
import { InMemorySpecialtyRepository } from "./infra/repositories/in-memory/specialty.repository";
import { AuthService } from "./infra/services/auth.service";
import { BcryptHashService } from "./infra/services/bcrypt-hash.service";
import {
  ITokenService,
  JwtTokenService,
} from "./infra/services/jwt-token.service";

// services
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

// repos
container.registerSingleton<ICustomerRepository>(
  "CustomerRepository",
  InMemoryCustomerRepository
);
container.registerSingleton<ISpecialtyRepository>(
  "SpecialtyRepository",
  InMemorySpecialtyRepository
);
container.registerSingleton<IBarberRepository>(
  "BarberRepository",
  InMemoryBarberRepository
);
container.registerSingleton<IBarberSpecialtyRepository>(
  "BarberSpecialtyRepository",
  InMemoryBarberSpecialtyRepository
);

// use cases
container.registerSingleton("GetAllSpecialties", GetAllSpecialties);
container.registerSingleton("CreateSpecialty", CreateSpecialty);
container.registerSingleton(
  "CreateBarberWithSpecialties",
  CreateBarberWithSpecialties
);
container.registerSingleton<GetAllBarberSpecialty>(
  "GetAllBarberSpecialty",
  GetAllBarberSpecialty
);
