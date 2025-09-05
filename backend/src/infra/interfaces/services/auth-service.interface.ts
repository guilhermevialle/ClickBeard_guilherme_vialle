import {
  AuthenticateCustomerDto,
  RegisterCustomerDto,
  UserSession,
} from "../../http/dtos/auth.dto";

export interface IAuthService {
  authenticateCustomer(data: AuthenticateCustomerDto): Promise<UserSession>;
  registerCustomer(data: RegisterCustomerDto): Promise<UserSession>;
  refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
