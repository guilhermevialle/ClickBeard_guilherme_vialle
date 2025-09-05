import { inject, injectable } from "tsyringe";
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from "../../application/errors/shared";
import { Customer } from "../../domain/entities/customer";
import {
  AuthenticateCustomerDto,
  RegisterCustomerDto,
  UserSession,
} from "../http/dtos/auth.dto";
import { AuthTokenPayload } from "../http/dtos/token.dto";
import type { ICustomerRepository } from "../interfaces/repositories/customer-repository.interface";
import type { IAuthService } from "../interfaces/services/auth-service.interface";
import type { IHashService } from "../interfaces/services/hash-service.interface";
import type { ITokenService } from "./jwt-token.service";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("CustomerRepository")
    private readonly customerRepo: ICustomerRepository,
    @inject("AccessTokenService")
    private readonly accessTokenService: ITokenService,
    @inject("RefreshTokenService")
    private readonly refreshTokenService: ITokenService,
    @inject("HashService")
    private readonly hashService: IHashService
  ) {}

  async authenticateCustomer({
    email,
    password,
  }: AuthenticateCustomerDto): Promise<UserSession> {
    const customer = await this.customerRepo.findByEmail(email);
    if (!customer)
      throw new InvalidCredentialsError("Invalid email or password.");

    const isPasswordValid = await this.hashService.compare(
      password,
      customer.password
    );
    if (!isPasswordValid)
      throw new InvalidCredentialsError("Invalid email or password.");

    const payload: AuthTokenPayload = { userId: customer.id };

    const accessToken = this.accessTokenService.sign(payload);
    const refreshToken = this.refreshTokenService.sign(payload);

    return {
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
      session: {
        accessToken,
        refreshToken,
      },
    };
  }

  async registerCustomer({
    email,
    password,
    name,
  }: RegisterCustomerDto): Promise<UserSession> {
    const customerExists = await this.customerRepo.findByEmail(email);
    if (customerExists)
      throw new UserAlreadyExistsError(
        `User with email ${email} already exists`
      );

    const hash = await this.hashService.hash(password);
    const customer = Customer.create({ name, email, password: hash });

    await this.customerRepo.save(customer);

    const payload: AuthTokenPayload = { userId: customer.id };

    const accessToken = this.accessTokenService.sign(payload);
    const refreshToken = this.refreshTokenService.sign(payload);

    return {
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
      session: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(
    oldRefreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload =
        this.refreshTokenService.verify<AuthTokenPayload>(oldRefreshToken);

      if (!payload)
        throw new InvalidCredentialsError("Invalid or expired refresh token.");

      const newAccessToken = this.accessTokenService.sign({
        userId: payload.userId,
      });

      const newRefreshToken = this.refreshTokenService.sign({
        userId: payload.userId,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new InvalidCredentialsError("Invalid or expired refresh token.");
    }
  }
}
