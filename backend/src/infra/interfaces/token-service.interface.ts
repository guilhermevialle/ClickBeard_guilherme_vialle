import { SignOptions, VerifyOptions } from "jsonwebtoken";

export interface ITokenService {
  sign(payload: object, options?: SignOptions): string;
  verify<T = any>(token: string, options?: VerifyOptions): T | null;
  decode<T = any>(token: string): T | null;
}
