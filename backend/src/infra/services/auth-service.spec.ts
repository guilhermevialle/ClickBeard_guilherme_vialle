import "reflect-metadata";

import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from "../../application/errors/shared";
import { Customer } from "../../domain/entities/customer";
import type { ICustomerRepository } from "../interfaces/customer-repository.interface";
import type { IHashService } from "../interfaces/hash-service.interface";
import type { ITokenService } from "../interfaces/token-service.interface";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let customerRepo: Mocked<ICustomerRepository>;
  let hashService: Mocked<IHashService>;
  let accessTokenService: Mocked<ITokenService>;
  let refreshTokenService: Mocked<ITokenService>;
  let service: AuthService;

  const fakeCustomer = Customer.create({
    name: "John Doe",
    email: "john@example.com",
    password: "hashed-password",
  });

  beforeEach(() => {
    customerRepo = {
      findByEmail: vi.fn(),
      save: vi.fn(),
    } as any;

    hashService = {
      hash: vi.fn(),
      compare: vi.fn(),
    } as any;

    accessTokenService = {
      sign: vi.fn(),
      verify: vi.fn(),
    } as any;

    refreshTokenService = {
      sign: vi.fn(),
      verify: vi.fn(),
    } as any;

    service = new AuthService(
      customerRepo,
      accessTokenService,
      refreshTokenService,
      hashService
    );
  });

  describe("authenticate", () => {
    it("should authenticate with valid credentials", async () => {
      customerRepo.findByEmail.mockResolvedValue(fakeCustomer);
      hashService.compare.mockResolvedValue(true);
      accessTokenService.sign.mockReturnValue("access-token");
      refreshTokenService.sign.mockReturnValue("refresh-token");

      const result = await service.authenticate({
        email: fakeCustomer.email,
        password: "plain-pass",
      });

      expect(result.user).toEqual({
        id: fakeCustomer.id,
        name: fakeCustomer.name,
        email: fakeCustomer.email,
      });
      expect(result.session.accessToken).toBe("access-token");
      expect(result.session.refreshToken).toBe("refresh-token");
    });

    it("should throw if email not found", async () => {
      customerRepo.findByEmail.mockResolvedValue(null);

      await expect(
        service.authenticate({ email: "nope@test.com", password: "123" })
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it("should throw if password invalid", async () => {
      customerRepo.findByEmail.mockResolvedValue(fakeCustomer);
      hashService.compare.mockResolvedValue(false);

      await expect(
        service.authenticate({ email: fakeCustomer.email, password: "wrong" })
      ).rejects.toThrow(InvalidCredentialsError);
    });
  });

  describe("register", () => {
    it("should register a new user", async () => {
      customerRepo.findByEmail.mockResolvedValue(null);
      hashService.hash.mockResolvedValue("hashed-pass");
      accessTokenService.sign.mockReturnValue("access-token");
      refreshTokenService.sign.mockReturnValue("refresh-token");
      customerRepo.save.mockResolvedValue();

      const result = await service.register({
        email: "new@test.com",
        password: "123456",
        name: "Alice",
      });

      expect(customerRepo.save).toHaveBeenCalled();
      expect(result.user.email).toBe("new@test.com");
      expect(result.session.accessToken).toBe("access-token");
    });

    it("should throw if user already exists", async () => {
      customerRepo.findByEmail.mockResolvedValue(fakeCustomer);

      await expect(
        service.register({
          email: fakeCustomer.email,
          password: "123456",
          name: "Alice",
        })
      ).rejects.toThrow(UserAlreadyExistsError);
    });
  });

  describe("refresh", () => {
    it("should return new access token", async () => {
      refreshTokenService.verify.mockReturnValue({ userId: fakeCustomer.id });
      accessTokenService.sign.mockReturnValue("new-access-token");

      const token = await service.refresh("valid-refresh");

      expect(token).toBe("new-access-token");
    });

    it("should throw if refresh token invalid", async () => {
      refreshTokenService.verify.mockImplementation(() => {
        throw new Error("invalid");
      });

      await expect(service.refresh("bad-token")).rejects.toThrow(
        InvalidCredentialsError
      );
    });
  });
});
