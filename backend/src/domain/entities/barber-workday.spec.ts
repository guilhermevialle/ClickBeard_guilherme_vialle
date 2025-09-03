import { describe, expect, it } from "vitest";
import { InvalidInputError } from "../errors/shared";
import { BarberWorkday } from "./barber-workday";

describe("BarberWorkday Entity", () => {
  it("should create a barber workday properly", () => {
    const workday = BarberWorkday.create({
      barberId: "barber-123",
      weekday: 1, // Segunda-feira
    });

    expect(workday.id).toBeDefined();
    expect(workday.barberId).toBe("barber-123");
    expect(workday.weekday).toBe(1);
  });

  it("should restore a barber workday properly", () => {
    const workdayProps = {
      id: "workday-123",
      barberId: "barber-123",
      weekday: 3, // Quarta-feira
    };

    const workday = BarberWorkday.from(workdayProps);

    expect(workday.id).toBe("workday-123");
    expect(workday.barberId).toBe("barber-123");
    expect(workday.weekday).toBe(3);
  });

  it("should throw InvalidInputError for invalid creation props", () => {
    const invalidPropsList = [
      { barberId: "", weekday: 1 },
      { barberId: "barber-123", weekday: -1 },
      { barberId: "barber-123", weekday: 7 },
    ];

    invalidPropsList.forEach((props) => {
      expect(() => BarberWorkday.create(props as any)).toThrow(
        InvalidInputError
      );
    });
  });

  it("should throw InvalidInputError for invalid restore props", () => {
    const invalidRestoreProps = [
      { id: "", barberId: "barber-123", weekday: 1 },
      { id: "workday-123", barberId: "", weekday: 1 },
      { id: "workday-123", barberId: "barber-123", weekday: -1 },
      { id: "workday-123", barberId: "barber-123", weekday: 7 },
    ];

    invalidRestoreProps.forEach((props) => {
      expect(() => BarberWorkday.from(props as any)).toThrow(InvalidInputError);
    });
  });
});
