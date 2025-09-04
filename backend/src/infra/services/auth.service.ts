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
    @inject("TokenService")
    private readonly tokenService: ITokenService,
    @inject("HashService")
    private readonly hashService: IHashService
  ) {}

  async authenticate({ email, password }: LoginDto): Promise<UserSession> {
    const customer = await this.customerRepo.findByEmail(email);

    if (!customer)
      throw new InvalidCredentialsError(`Invalid email or password.`);

    const isPasswordValid = await this.hashService.compare(
      password,
      customer.password
    );

    if (!isPasswordValid)
      throw new InvalidCredentialsError(`Invalid email or password.`);

    const payload: AuthTokenPayload = {
      userId: customer.id,
    };

    const token = this.tokenService.sign(payload, {
      expiresIn: 3600, // 1 hour,
    });
    const refreshToken = this.tokenService.sign(payload, {
      expiresIn: 604800, // 7 days,
    });

    return {
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
      session: {
        token,
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
    const customer = Customer.create({
      name,
      email,
      password: hash,
    });

    await this.customerRepo.save(customer);

    const payload: AuthTokenPayload = {
      userId: customer.id,
    };

    const token = this.tokenService.sign(payload, {
      expiresIn: 3600, // 1 hour,
    });
    const refreshToken = this.tokenService.sign(payload, {
      expiresIn: 604800, // 7 days,
    });

    return {
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
      session: {
        token,
        refreshToken,
      },
    };
  }
}
