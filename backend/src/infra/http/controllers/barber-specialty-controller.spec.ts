import "reflect-metadata";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import type { GetAllBarberSpecialty } from "../../../application/use-cases/get-all-barber-specialty";
import { BarberSpecialtyController } from "./barber-specialty.controller";

describe("BarberSpecialtyController", () => {
  let getAllBarberSpecialtyMock: Mocked<GetAllBarberSpecialty>;
  let controller: BarberSpecialtyController;
  let replyMock: any;

  beforeEach(() => {
    getAllBarberSpecialtyMock = {
      execute: vi.fn(),
    } as unknown as Mocked<GetAllBarberSpecialty>;

    controller = new BarberSpecialtyController(getAllBarberSpecialtyMock);

    replyMock = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  it("should return all barber specialties with status 200", async () => {
    const barberSpecialtiesMock = [
      {
        toJSON: vi
          .fn()
          .mockReturnValue({ id: "bs-1", barberId: "b-1", specialtyId: "s-1" }),
      },
      {
        toJSON: vi
          .fn()
          .mockReturnValue({ id: "bs-2", barberId: "b-2", specialtyId: "s-2" }),
      },
    ];

    getAllBarberSpecialtyMock.execute.mockResolvedValue(
      barberSpecialtiesMock as any
    );

    await controller.getAll({} as any, replyMock);

    expect(getAllBarberSpecialtyMock.execute).toHaveBeenCalled();
    expect(replyMock.status).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith([
      { id: "bs-1", barberId: "b-1", specialtyId: "s-1" },
      { id: "bs-2", barberId: "b-2", specialtyId: "s-2" },
    ]);
  });
});
