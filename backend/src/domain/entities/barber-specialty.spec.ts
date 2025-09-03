import { describe, expect, it } from "vitest";
import { InvalidInputError } from "../errors/shared";
import { BarberSpecialty } from "./barber-specialty";

describe("BarberSpecialty Entity", () => {
  it("should create a barber-specialty properly", () => {
    const bs = BarberSpecialty.create({
      barberId: "barber-123",
      specialtyId: "specialty-456",
    });

    expect(bs.id).toBeDefined();
    expect(bs.barberId).toBe("barber-123");
    expect(bs.specialtyId).toBe("specialty-456");
  });

  it("should restore a barber-specialty properly", () => {
    const bs = BarberSpecialty.from({
      id: "bs-789",
      barberId: "barber-123",
      specialtyId: "specialty-456",
    });

    expect(bs.id).toBe("bs-789");
    expect(bs.barberId).toBe("barber-123");
    expect(bs.specialtyId).toBe("specialty-456");
  });

  it("should throw InvalidInputError for invalid props", () => {
    expect(() =>
      BarberSpecialty.create({
        barberId: "",
        specialtyId: "specialty-456",
      } as any)
    ).toThrow(InvalidInputError);

    expect(() =>
      BarberSpecialty.create({ barberId: "barber-123", specialtyId: "" } as any)
    ).toThrow(InvalidInputError);

    expect(() =>
      BarberSpecialty.create({ barberId: "", specialtyId: "" } as any)
    ).toThrow(InvalidInputError);

    expect(() =>
      BarberSpecialty.from({
        id: "",
        barberId: "barber-123",
        specialtyId: "specialty-456",
      } as any)
    ).toThrow(InvalidInputError);

    expect(() =>
      BarberSpecialty.from({
        id: "bs-789",
        barberId: "",
        specialtyId: "specialty-456",
      } as any)
    ).toThrow(InvalidInputError);

    expect(() =>
      BarberSpecialty.from({
        id: "bs-789",
        barberId: "barber-123",
        specialtyId: "",
      } as any)
    ).toThrow(InvalidInputError);
  });
});
