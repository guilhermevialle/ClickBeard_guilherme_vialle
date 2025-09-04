import bcrypt from "bcrypt";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BcryptHashService } from "./bcrypt-hash.service";

vi.mock("bcrypt");

describe("BcryptHashService", () => {
  let hashService: BcryptHashService;

  beforeEach(() => {
    vi.clearAllMocks();
    hashService = new BcryptHashService(12);
  });

  it("should hash a password using bcrypt", async () => {
    const fakeHash = "hashed_password";
    vi.mocked(bcrypt.hash).mockResolvedValue(fakeHash as any);

    const result = await hashService.hash("plain_password");

    expect(bcrypt.hash).toHaveBeenCalledWith("plain_password", 12);
    expect(result).toBe(fakeHash);
  });

  it("should compare a password with hash and return true", async () => {
    vi.mocked(bcrypt.compare).mockResolvedValue(true as any);

    const result = await hashService.compare(
      "plain_password",
      "hashed_password"
    );

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "plain_password",
      "hashed_password"
    );
    expect(result).toBe(true);
  });

  it("should compare a password with hash and return false", async () => {
    vi.mocked(bcrypt.compare).mockResolvedValue(false as any);

    const result = await hashService.compare(
      "plain_password",
      "hashed_password"
    );

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "plain_password",
      "hashed_password"
    );
    expect(result).toBe(false);
  });
});
