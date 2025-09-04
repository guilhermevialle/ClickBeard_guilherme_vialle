import { Customer } from "../../domain/entities/customer";
import { CustomerSession, LoginDto, RegisterDto } from "../dtos/auth.dto";

export interface IAuthService {
  login(data: LoginDto): Promise<CustomerSession>;
  register(data: RegisterDto): Promise<Customer>;
}
