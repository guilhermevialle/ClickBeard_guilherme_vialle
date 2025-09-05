import "reflect-metadata";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { Specialty } from "../../domain/entities/specialty";
import type { ISpecialtyRepository } from "../../infra/interfaces/repositories/specialty-repository.interface";
import { GetAllSpecialties } from "./get-all-specialties";

describe("GetAllSpecialties Use-Case", () => {
  let specialtyRepoMock: Mocked<ISpecialtyRepository>;
  let getAllSpecialties: GetAllSpecialties;

  beforeEach(() => {
    specialtyRepoMock = {
      findAll: vi.fn(),
    } as unknown as Mocked<ISpecialtyRepository>;
    getAllSpecialties = new GetAllSpecialties(specialtyRepoMock);
  });

  it("should return all specialties", async () => {
    const mockSpecialties: Specialty[] = [
      { id: "s-1", name: "Haircut", durationInMinutes: 30 } as any,
      { id: "s-2", name: "Beard Trim", durationInMinutes: 20 } as any,
    ];

    specialtyRepoMock.findAll.mockResolvedValue(mockSpecialties);

    const result = await getAllSpecialties.execute();

    expect(result).toEqual(mockSpecialties);
    expect(specialtyRepoMock.findAll).toHaveBeenCalled();
  });
});
