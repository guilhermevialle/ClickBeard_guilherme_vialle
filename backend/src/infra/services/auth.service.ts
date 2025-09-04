import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from "../../application/errors/shared";
import { Customer } from "../../domain/entities/customer";
import { CustomerSession, LoginDto, RegisterDto } from "../dtos/auth.dto";
import { AuthTokenPayload } from "../dtos/token.dto";
import { IAuthService } from "../interfaces/auth-service.interface";
import { ICustomerRepository } from "../interfaces/customer-repository.interface";
import { IHashService } from "../interfaces/hash-service.interface";
import { ITokenService } from "../interfaces/token-service.interface";

export class AuthService implements IAuthService {
  constructor(
    private readonly customerRepo: ICustomerRepository,
    private readonly accessTokenService: ITokenService,
    private readonly refreshTokenService: ITokenService,
    private readonly hashService: IHashService
  ) {}

  async login({ email, password }: LoginDto): Promise<CustomerSession> {
    const customer = await this.customerRepo.findByEmail(email);

    if (!customer)
      throw new InvalidCredentialsError(`Invalid email or password.`);

    const isPwValid = await this.hashService.compare(
      password,
      customer.password
    );

    if (!isPwValid)
      throw new InvalidCredentialsError(`Invalid email or password.`);

    const payload: AuthTokenPayload = {
      userId: customer.id,
    };

    const token = this.accessTokenService.sign(payload, {
      expiresIn: 3600, // 1 hour,
    });
    const refreshToken = this.refreshTokenService.sign(payload, {
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

  async register({ email, password, name }: RegisterDto): Promise<Customer> {
    const customerExists = await this.customerRepo.findByEmail(email);

    if (customerExists)
      throw new UserAlreadyExistsError(
        `User with email ${email} already exists`
      );

    const pwHash = await this.hashService.hash(password);

    const customer = Customer.create({
      name,
      email,
      password: pwHash,
    });

    await this.customerRepo.save(customer);

    return customer;
  }
}
