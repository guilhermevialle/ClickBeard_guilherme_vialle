import { inject, injectable } from "tsyringe";
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from "../../application/errors/shared";
import { Customer } from "../../domain/entities/customer";
import { LoginDto, RegisterDto, UserSession } from "../dtos/auth.dto";
import { AuthTokenPayload } from "../dtos/token.dto";
import type { IAuthService } from "../interfaces/auth-service.interface";
import type { ICustomerRepository } from "../interfaces/customer-repository.interface";
import type { IHashService } from "../interfaces/hash-service.interface";
import type { ITokenService } from "../interfaces/token-service.interface";

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

  async authenticate({ email, password }: LoginDto): Promise<UserSession> {
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

  async register({ email, password, name }: RegisterDto): Promise<UserSession> {
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

  async refresh(refreshToken: string): Promise<string> {
    try {
      const payload =
        this.refreshTokenService.verify<AuthTokenPayload>(refreshToken);

      const newAccessToken = this.accessTokenService.sign({
        userId: payload?.userId,
      });

      return newAccessToken;
    } catch {
      throw new InvalidCredentialsError("Invalid or expired refresh token.");
    }
  }
}
