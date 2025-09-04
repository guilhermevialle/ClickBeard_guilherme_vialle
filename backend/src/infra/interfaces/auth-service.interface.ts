import { LoginDto, RegisterDto, UserSession } from "../dtos/auth.dto";

export interface IAuthService {
  authenticate(data: LoginDto): Promise<UserSession>;
  register(data: RegisterDto): Promise<UserSession>;
  refresh(refreshToken: string): Promise<string>;
}
