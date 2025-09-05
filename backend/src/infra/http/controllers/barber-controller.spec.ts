import { subDays } from "date-fns";
import "reflect-metadata";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { BadRequestError } from "../../../application/errors/shared";
import type { CreateBarberWithSpecialties } from "../../../application/use-cases/create-barber-with-specialties";
import type { FindBarberSlotsByDate } from "../../../application/use-cases/find-barber-slots-by-date";
import type { GetAllBarbers } from "../../../application/use-cases/get-all-barbers";
import type { GetAllBarbersForBff } from "../../../application/use-cases/get-all-barbers-for-bff";
import { BarberController } from "./barber.controller";

describe("BarberController", () => {
  let createBarberMock: Mocked<CreateBarberWithSpecialties>;
  let getAllBarbersMock: Mocked<GetAllBarbers>;
  let getAllForBffMock: Mocked<GetAllBarbersForBff>;
  let findSlotsMock: Mocked<FindBarberSlotsByDate>;
  let controller: BarberController;
  let replyMock: any;

  beforeEach(() => {
    createBarberMock = {
      execute: vi.fn(),
    } as unknown as Mocked<CreateBarberWithSpecialties>;
    getAllBarbersMock = {
      execute: vi.fn(),
    } as unknown as Mocked<GetAllBarbers>;
    getAllForBffMock = {
      execute: vi.fn(),
    } as unknown as Mocked<GetAllBarbersForBff>;
    findSlotsMock = {
      execute: vi.fn(),
    } as unknown as Mocked<FindBarberSlotsByDate>;

    controller = new BarberController(
      createBarberMock,
      getAllBarbersMock,
      getAllForBffMock,
      findSlotsMock
    );

    replyMock = { status: vi.fn().mockReturnThis(), send: vi.fn() };
  });

  it("should return barber slots by date", async () => {
    const request = { body: { barberId: "b-1", date: new Date() } };
    const slotsMock = ["09:00", "09:30"];
    findSlotsMock.execute.mockResolvedValue(slotsMock as any);

    await controller.getBarberSlotsByDate(request as any, replyMock);

    expect(findSlotsMock.execute).toHaveBeenCalledWith(request.body);
    expect(replyMock.status).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith(slotsMock);
  });

  it("should throw BadRequestError if getBarberSlotsByDate validation fails", async () => {
    const request = { body: {} }; // invalid payload

    await expect(
      controller.getBarberSlotsByDate(request as any, replyMock)
    ).rejects.toThrow(BadRequestError);
  });

  it("should create a barber", async () => {
    const request = {
      body: {
        name: "John",
        age: 30,
        hiredAt: subDays(new Date(), 20),
        specialtyIds: ["s-1"],
      },
    };
    const barberMock = {
      toJSON: vi.fn().mockReturnValue({ id: "b-1", name: "John" }),
    };
    createBarberMock.execute.mockResolvedValue(barberMock as any);

    await controller.createBarber(request as any, replyMock);

    expect(createBarberMock.execute).toHaveBeenCalledWith(request.body);
    expect(replyMock.status).toHaveBeenCalledWith(201);
    expect(replyMock.send).toHaveBeenCalledWith({ id: "b-1", name: "John" });
  });

  it("should throw BadRequestError if createBarber validation fails", async () => {
    const request = { body: {} }; // invalid payload

    await expect(
      controller.createBarber(request as any, replyMock)
    ).rejects.toThrow(BadRequestError);
  });

  it("should get all barbers", async () => {
    const barbersMock = [{ toJSON: () => ({ id: "b-1", name: "John" }) }];
    getAllBarbersMock.execute.mockResolvedValue(barbersMock as any);

    await controller.getAll({} as any, replyMock);

    expect(getAllBarbersMock.execute).toHaveBeenCalled();
    expect(replyMock.status).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith([{ id: "b-1", name: "John" }]);
  });
});
