import { container } from "tsyringe";
import { CancelAppointment } from "./application/use-cases/cancel-appointment";
import { CreateAppointment } from "./application/use-cases/create-appointment";
import { CreateBarberWithSpecialties } from "./application/use-cases/create-barber-with-specialties";
import { CreateSpecialty } from "./application/use-cases/create-specialty";
import { FindBarberSlotsByDate } from "./application/use-cases/find-barber-slots-by-date";
import { GetAllBarberSpecialty } from "./application/use-cases/get-all-barber-specialty";
import { GetAllBarbers } from "./application/use-cases/get-all-barbers";
import { GetAllBarbersForBff } from "./application/use-cases/get-all-barbers-for-bff";
import { GetAllSpecialties } from "./application/use-cases/get-all-specialties";
import { GetCustomerAppointmentsBff } from "./application/use-cases/get-customer-appointments-bff";
import { PrismaClient } from "./generated/prisma";
import { AuthMiddleware } from "./infra/http/middlewares/auth.middleware";
import { IAppointmentRepository } from "./infra/interfaces/repositories/appointment-repository.interface";
import { IBarberRepository } from "./infra/interfaces/repositories/barber-repository.interface";
import { IBarberSpecialtyRepository } from "./infra/interfaces/repositories/barber-specialty-repository.interface";
import { ICustomerRepository } from "./infra/interfaces/repositories/customer-repository.interface";
import { ISpecialtyRepository } from "./infra/interfaces/repositories/specialty-repository.interface";
import type { IAuthService } from "./infra/interfaces/services/auth-service.interface";
import { IBarberAvailabilityService } from "./infra/interfaces/services/barber-availability-service.interface";
import type { IHashService } from "./infra/interfaces/services/hash-service.interface";
import { PostgresPrismaAppointmentRepository } from "./infra/repositories/postgres/postgres-prisma-appointment.repository";
import { PostgresPrismaBarberSpecialtyRepository } from "./infra/repositories/postgres/postgres-prisma-barber-specialty.repository";
import { PostgresPrismaBarberRepository } from "./infra/repositories/postgres/postgres-prisma-barber.repository";
import { PostgresPrismaCustomerRepository } from "./infra/repositories/postgres/postgres-prisma-customer.repository";
import { PostgresPrismaSpecialtyRepository } from "./infra/repositories/postgres/postgres-prisma-specialty.repository";
import { PrismaClientType } from "./infra/repositories/postgres/prisma/client";
import { AuthService } from "./infra/services/auth.service";
import { BarberAvailabilityService } from "./infra/services/barber-availability.service";
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
container.registerSingleton<IBarberAvailabilityService>(
  "BarberAvailabilityService",
  BarberAvailabilityService
);

// repos
container.registerSingleton<ICustomerRepository>(
  "CustomerRepository",
  PostgresPrismaCustomerRepository
);
container.registerSingleton<ISpecialtyRepository>(
  "SpecialtyRepository",
  PostgresPrismaSpecialtyRepository
);
container.registerSingleton<IBarberRepository>(
  "BarberRepository",
  PostgresPrismaBarberRepository
);
container.registerSingleton<IBarberSpecialtyRepository>(
  "BarberSpecialtyRepository",
  PostgresPrismaBarberSpecialtyRepository
);
container.registerSingleton<IAppointmentRepository>(
  "AppointmentRepository",
  PostgresPrismaAppointmentRepository
);

// adapters
const prismaClient = new PrismaClient();
container.registerInstance<PrismaClientType>("PrismaClient", prismaClient);

// use cases
container.registerSingleton<GetAllBarbersForBff>(
  "GetAllBarbersForBff",
  GetAllBarbersForBff
);
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
container.registerSingleton<GetAllBarbers>("GetAllBarbers", GetAllBarbers);
container.registerSingleton<FindBarberSlotsByDate>(
  "FindBarberSlotsByDate",
  FindBarberSlotsByDate
);
container.registerSingleton<CreateAppointment>(
  "CreateAppointment",
  CreateAppointment
);
container.registerSingleton<GetCustomerAppointmentsBff>(
  "GetCustomerAppointmentsBff",
  GetCustomerAppointmentsBff
);
container.registerSingleton<CancelAppointment>(
  "CancelAppointment",
  CancelAppointment
);

// middlewares
container.registerSingleton<AuthMiddleware>("AuthMiddleware", AuthMiddleware);
