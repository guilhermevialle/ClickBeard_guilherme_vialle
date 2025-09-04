import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { JwtTokenService } from "./jwt-token.service";

vi.mock("jsonwebtoken");

describe("JwtTokenService", () => {
  let tokenService: JwtTokenService;
  const secret = "test_secret";
  const expiresIn = "1h";

  beforeEach(() => {
    vi.clearAllMocks();
    tokenService = new JwtTokenService(secret, expiresIn);
  });

  it("should sign a payload with secret and expiresIn", () => {
    const fakeToken = "signed_token";
    vi.mocked(jwt.sign).mockReturnValue(fakeToken as any);

    const payload = { userId: "123" };
    const result = tokenService.sign(payload, { algorithm: "HS256" });

    expect(jwt.sign).toHaveBeenCalledWith(payload, secret, {
      algorithm: "HS256",
      expiresIn,
    });
    expect(result).toBe(fakeToken);
  });

  it("should verify a valid token and return payload", () => {
    const decoded = { userId: "123" };
    vi.mocked(jwt.verify).mockReturnValue(decoded as any);

    const result = tokenService.verify<{ userId: string }>("valid_token");

    expect(jwt.verify).toHaveBeenCalledWith("valid_token", secret, undefined);
    expect(result).toEqual(decoded);
  });

  it("should return null if verify throws", () => {
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const result = tokenService.verify("invalid_token");

    expect(result).toBeNull();
  });

  it("should decode a token", () => {
    const decoded = { userId: "123" };
    vi.mocked(jwt.decode).mockReturnValue(decoded as any);

    const result = tokenService.decode<{ userId: string }>("any_token");

    expect(jwt.decode).toHaveBeenCalledWith("any_token");
    expect(result).toEqual(decoded);
  });

  it("should return null when decode returns null", () => {
    vi.mocked(jwt.decode).mockReturnValue(null);

    const result = tokenService.decode("any_token");

    expect(result).toBeNull();
  });
});
