import {
  AuthenticateCustomerDto,
  RegisterBarberDto,
  RegisterCustomerDto,
  UserSession,
} from "../../dtos/auth.dto";

export interface IAuthService {
  authenticateCustomer(data: AuthenticateCustomerDto): Promise<UserSession>;
  registerCustomer(data: RegisterCustomerDto): Promise<UserSession>;
  registerBarber(data: RegisterBarberDto): Promise<void>;
  refreshToken(refreshToken: string): Promise<string>;
}
