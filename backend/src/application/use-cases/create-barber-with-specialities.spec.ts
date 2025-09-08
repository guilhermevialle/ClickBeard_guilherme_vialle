import "reflect-metadata";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { Barber } from "../../domain/aggregates/barber";
import type { IBarberRepository } from "../../infra/interfaces/repositories/barber-repository.interface";
import type { IBarberSpecialtyRepository } from "../../infra/interfaces/repositories/barber-specialty-repository.interface";
import type { ISpecialtyRepository } from "../../infra/interfaces/repositories/specialty-repository.interface";
import { BarberAlreadyExistsError } from "../errors/shared";
import { CreateBarberWithSpecialties } from "./create-barber-with-specialties";

describe("CreateBarberWithSpecialties Use-Case", () => {
  let barberRepoMock: Mocked<IBarberRepository>;
  let specialtyRepoMock: Mocked<ISpecialtyRepository>;
  let barberSpecialtyRepoMock: Mocked<IBarberSpecialtyRepository>;
  let createBarberUseCase: CreateBarberWithSpecialties;

  beforeEach(() => {
    barberRepoMock = {
      findByName: vi.fn(),
      save: vi.fn(),
    } as unknown as Mocked<IBarberRepository>;

    specialtyRepoMock = {
      findById: vi.fn(),
    } as unknown as Mocked<ISpecialtyRepository>;

    barberSpecialtyRepoMock = {
      save: vi.fn(),
    } as unknown as Mocked<IBarberSpecialtyRepository>;

    createBarberUseCase = new CreateBarberWithSpecialties(
      barberRepoMock,
      specialtyRepoMock,
      barberSpecialtyRepoMock
    );
  });

  it("should throw BarberAlreadyExistsError if barber already exists", async () => {
    barberRepoMock.findByName.mockResolvedValue({
      id: "b-1",
      name: "John",
    } as any);

    await expect(
      createBarberUseCase.execute({
        name: "John",
        age: 30,
        hiredAt: new Date("2020-01-01"),
        specialtyIds: ["s-1"],
      })
    ).rejects.toThrow(BarberAlreadyExistsError);
  });

  it("should create barber and save specialties when valid", async () => {
    barberRepoMock.findByName.mockResolvedValue(null);
    specialtyRepoMock.findById.mockImplementation(
      async (id) => ({ id }) as any
    );

    const barber = await createBarberUseCase.execute({
      name: "New Barber",
      age: 25,
      hiredAt: new Date("2020-01-01"),
      specialtyIds: ["s-1", "s-2"],
    });

    expect(barber).toBeInstanceOf(Barber);
    expect(barberRepoMock.save).toHaveBeenCalledWith(barber);
    expect(specialtyRepoMock.findById).toHaveBeenCalledTimes(2);
    expect(barberSpecialtyRepoMock.save).toHaveBeenCalledTimes(2);

    barberSpecialtyRepoMock.save.mock.calls.forEach(([savedBs]) => {
      expect(savedBs).toHaveProperty("barberId", barber.id);
    });
  });

  it("should ignore null specialties", async () => {
    barberRepoMock.findByName.mockResolvedValue(null);
    specialtyRepoMock.findById.mockImplementation(async (id) =>
      id === "s-1" ? { id } : (null as any)
    );

    const barber = await createBarberUseCase.execute({
      name: "Partial Barber",
      age: 28,
      hiredAt: new Date("2020-01-01"),
      specialtyIds: ["s-1", "s-2"],
    });

    expect(barberSpecialtyRepoMock.save).toHaveBeenCalledTimes(1);
    // @ts-expect-error possibly null
    expect(barberSpecialtyRepoMock.save.mock.calls[0][0]).toHaveProperty(
      "specialtyId",
      "s-1"
    );
  });
});
