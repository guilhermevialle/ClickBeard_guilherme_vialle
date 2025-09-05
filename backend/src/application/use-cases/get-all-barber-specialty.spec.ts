import "reflect-metadata";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { BarberSpecialty } from "../../domain/entities/barber-specialty";
import type { IBarberSpecialtyRepository } from "../../infra/interfaces/repositories/barber-specialty-repository.interface";
import { GetAllBarberSpecialty } from "./get-all-barber-specialty";

describe("GetAllBarberSpecialty Use-Case", () => {
  let barberSpecialtyRepoMock: Mocked<IBarberSpecialtyRepository>;
  let getAllBarberSpecialty: GetAllBarberSpecialty;

  beforeEach(() => {
    barberSpecialtyRepoMock = {
      findAll: vi.fn(),
    } as unknown as Mocked<IBarberSpecialtyRepository>;

    getAllBarberSpecialty = new GetAllBarberSpecialty(barberSpecialtyRepoMock);
  });

  it("should return all barber specialties", async () => {
    const mockSpecialties: BarberSpecialty[] = [
      { id: "bs-1", barberId: "b-1", specialtyId: "s-1" } as any,
      { id: "bs-2", barberId: "b-2", specialtyId: "s-2" } as any,
    ];

    barberSpecialtyRepoMock.findAll.mockResolvedValue(mockSpecialties);

    const result = await getAllBarberSpecialty.execute();

    expect(result).toEqual(mockSpecialties);
    expect(barberSpecialtyRepoMock.findAll).toHaveBeenCalled();
  });
});
