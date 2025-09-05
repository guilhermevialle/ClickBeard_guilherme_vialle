import "reflect-metadata";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { BadRequestError } from "../../../application/errors/shared";
import type { IAuthService } from "../../interfaces/services/auth-service.interface";
import { AuthController } from "./auth.controller";

describe("AuthController", () => {
  let authServiceMock: Mocked<IAuthService>;
  let controller: AuthController;
  let replyMock: any;

  beforeEach(() => {
    authServiceMock = {
      authenticateCustomer: vi.fn(),
      registerCustomer: vi.fn(),
      refreshToken: vi.fn(),
    } as unknown as Mocked<IAuthService>;

    controller = new AuthController(authServiceMock);

    replyMock = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  it("should authenticate a user and return session", async () => {
    const request = { body: { email: "test@test.com", password: "1234" } };
    const sessionMock = { accessToken: "abc", refreshToken: "def" };
    authServiceMock.authenticateCustomer.mockResolvedValue(sessionMock as any);

    await controller.authenticate(request as any, replyMock);

    expect(authServiceMock.authenticateCustomer).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "1234",
    });
    expect(replyMock.status).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith(sessionMock);
  });

  it("should throw BadRequestError if authenticate validation fails", async () => {
    const request = { body: {} };

    await expect(
      controller.authenticate(request as any, replyMock)
    ).rejects.toThrow(BadRequestError);
  });

  it("should register a user and return session", async () => {
    const request = {
      body: { name: "John", email: "john@test.com", password: "1234" },
    };
    const sessionMock = { accessToken: "abc", refreshToken: "def" };
    authServiceMock.registerCustomer.mockResolvedValue(sessionMock as any);

    await controller.register(request as any, replyMock);

    expect(authServiceMock.registerCustomer).toHaveBeenCalledWith({
      name: "John",
      email: "john@test.com",
      password: "1234",
    });
    expect(replyMock.status).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith(sessionMock);
  });

  it("should throw BadRequestError if register validation fails", async () => {
    const request = { body: {} };

    await expect(
      controller.register(request as any, replyMock)
    ).rejects.toThrow(BadRequestError);
  });

  it("should refresh session and return new tokens", async () => {
    const request = {
      body: {
        refreshToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYifQ.sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      },
    };
    const tokensMock = { accessToken: "new-abc", refreshToken: "new-def" };
    authServiceMock.refreshToken.mockResolvedValue(tokensMock);

    await controller.refreshSession(request as any, replyMock);

    expect(authServiceMock.refreshToken).toHaveBeenCalledWith(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYifQ.sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    );
    expect(replyMock.status).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith(tokensMock);
  });

  it("should throw BadRequestError if refresh validation fails", async () => {
    const request = { body: {} };

    await expect(
      controller.refreshSession(request as any, replyMock)
    ).rejects.toThrow(BadRequestError);
  });
});
