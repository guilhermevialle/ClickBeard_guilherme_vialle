import "reflect-metadata";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { Specialty } from "../../domain/entities/specialty";
import type { ISpecialtyRepository } from "../../infra/interfaces/repositories/specialty-repository.interface";
import { SpecialtyAlreadyExistsError } from "../errors/shared";
import { CreateSpecialty } from "./create-specialty";

describe("CreateSpecialty Use-Case", () => {
  let specialtyRepoMock: Mocked<ISpecialtyRepository>;
  let createSpecialty: CreateSpecialty;

  beforeEach(() => {
    specialtyRepoMock = {
      findByName: vi.fn(),
      save: vi.fn(),
    } as unknown as Mocked<ISpecialtyRepository>;

    createSpecialty = new CreateSpecialty(specialtyRepoMock);
  });

  it("should throw SpecialtyAlreadyExistsError if specialty already exists", async () => {
    specialtyRepoMock.findByName.mockResolvedValue({
      id: "s-1",
      name: "Haircut",
    } as any);

    await expect(
      createSpecialty.execute({ name: "Haircut", durationInMinutes: 30 })
    ).rejects.toThrow(SpecialtyAlreadyExistsError);

    expect(specialtyRepoMock.findByName).toHaveBeenCalledWith("Haircut");
    expect(specialtyRepoMock.save).not.toHaveBeenCalled();
  });

  it("should create and save a new specialty when valid", async () => {
    specialtyRepoMock.findByName.mockResolvedValue(null);

    const specialty = await createSpecialty.execute({
      name: "Beard Trim",
      durationInMinutes: 20,
    });

    expect(specialty).toBeInstanceOf(Specialty);
    expect(specialtyRepoMock.save).toHaveBeenCalledWith(specialty);
    expect(specialty.name).toBe("Beard Trim");
    expect(specialty.durationInMinutes).toBe(20);
  });
});
