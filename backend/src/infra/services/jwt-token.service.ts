import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

export interface ITokenService {
  sign(payload: object, options?: SignOptions): string;
  verify<T = any>(token: string, options?: VerifyOptions): T | null;
  decode<T = any>(token: string): T | null;
}

export class JwtTokenService implements ITokenService {
  constructor(private readonly secret: string) {}

  sign(payload: object, options?: SignOptions): string {
    return jwt.sign(payload, this.secret, options);
  }

  verify<T = any>(token: string, options?: VerifyOptions): T | null {
    try {
      return jwt.verify(token, this.secret, options) as T;
    } catch {
      return null;
    }
  }

  decode<T = any>(token: string): T | null {
    return jwt.decode(token) as T | null;
  }
}
