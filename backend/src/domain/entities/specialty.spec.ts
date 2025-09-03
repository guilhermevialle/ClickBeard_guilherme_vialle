import { describe, expect, it } from "vitest";
import { BadRequestError } from "../errors/shared";
import { Specialty } from "./specialty";

describe("Specialty Entity", () => {
  it("should create a specialty properly", () => {
    const specialty = Specialty.create({
      name: "Haircut",
      durationInMinutes: 30,
    });

    expect(specialty.id).toBeDefined();
    expect(specialty.name).toBe("Haircut");
  });

  it("should restore a specialty properly", () => {
    const specialty = Specialty.from({
      id: "specialty-123",
      name: "Beard",
      durationInMinutes: 30,
    });

    expect(specialty.id).toBe("specialty-123");
    expect(specialty.name).toBe("Beard");
  });

  it("should throw BadRequestError when creating with invalid props", () => {
    expect(() =>
      Specialty.create({
        name: "",
      } as any)
    ).toThrow(BadRequestError);
    expect(() =>
      Specialty.from({
        id: "specialty-123",
        name: "",
      } as any)
    ).toThrow(BadRequestError);
    expect(() =>
      Specialty.from({
        name: "Beard",
      } as any)
    ).toThrow(BadRequestError);
  });
});
