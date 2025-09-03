import { describe, expect, it } from "vitest";
import { InvalidInputError } from "../errors/shared";
import { Barber } from "./barber";

describe("Barber Entity", () => {
  it("should create a barber properly", () => {
    const barber = Barber.create({
      name: "John Doe",
      age: 30,
      hiredAt: new Date("2025-01-01"),
    });

    expect(barber.id).toBeDefined();
    expect(barber.name).toBe("John Doe");
    expect(barber.age).toBe(30);
    expect(barber.hiredAt).toEqual(new Date("2025-01-01"));
  });

  it("should restore a barber properly", () => {
    const barber = Barber.from({
      id: "barber-123",
      name: "Jane Doe",
      age: 25,
      hiredAt: new Date("2024-06-01"),
    });

    expect(barber.id).toBe("barber-123");
    expect(barber.name).toBe("Jane Doe");
    expect(barber.age).toBe(25);
    expect(barber.hiredAt).toEqual(new Date("2024-06-01"));
  });

  it("should throw InvalidInputError when creating with invalid props", () => {
    expect(() =>
      Barber.create({
        name: "",
        age: -5,
        hiredAt: "invalid-date" as any,
      } as any)
    ).toThrow(InvalidInputError);
    expect(() =>
      Barber.from({
        id: "barber-123",
        name: "",
        age: -10,
        hiredAt: "invalid-date" as any,
      } as any)
    ).toThrow(InvalidInputError);
    expect(() =>
      Barber.from({
        name: "Jane Doe",
        age: 25,
        hiredAt: new Date("2024-06-01"),
      } as any)
    ).toThrow(InvalidInputError);
  });
});
