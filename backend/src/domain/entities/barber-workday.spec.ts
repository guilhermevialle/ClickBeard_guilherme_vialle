import { describe, expect, it } from "vitest";
import { BarberWorkday } from "../entities/barber-workday";
import { BarberWorkdayShift } from "../entities/barber-workday-shift";
import { InvalidInputError } from "../errors/shared";

describe("BarberWorkday Entity", () => {
  it("should create a workday correctly", () => {
    const workday = BarberWorkday.create({ barberId: "barber-1", weekday: 2 });

    expect(workday.id).toBeDefined();
    expect(workday.barberId).toBe("barber-1");
    expect(workday.weekday).toBe(2);
    expect(workday.shifts.length).toBe(0);
  });

  it("should restore a workday from props", () => {
    const props = {
      id: "wd-123",
      barberId: "barber-2",
      weekday: 4,
      shifts: [],
    };
    const workday = BarberWorkday.from(props);

    expect(workday.id).toBe("wd-123");
    expect(workday.barberId).toBe("barber-2");
    expect(workday.weekday).toBe(4);
    expect(workday.shifts.length).toBe(0);
  });

  it("should add multiple shifts to a workday", () => {
    const workday = BarberWorkday.create({ barberId: "barber-3", weekday: 1 });

    workday.addShifts([
      { startAtInMinutes: 8 * 60, endAtInMinutes: 12 * 60 },
      { startAtInMinutes: 13 * 60, endAtInMinutes: 17 * 60 },
    ]);

    expect(workday.shifts.length).toBe(2);

    expect(workday.shifts[0]).toBeInstanceOf(BarberWorkdayShift);
    expect(workday.shifts[0]?.startAtInMinutes).toBe(480);
    expect(workday.shifts[0]?.endAtInMinutes).toBe(720);

    expect(workday.shifts[1]?.startAtInMinutes).toBe(780);
    expect(workday.shifts[1]?.endAtInMinutes).toBe(1020);
  });

  it("should return correct JSON", () => {
    const workday = BarberWorkday.create({ barberId: "barber-4", weekday: 5 });
    workday.addShifts([{ startAtInMinutes: 9 * 60, endAtInMinutes: 17 * 60 }]);

    const json = workday.toJSON();

    expect(json).toEqual({
      id: workday.id,
      barberId: "barber-4",
      weekday: 5,
      shifts: [
        {
          id: workday.shifts[0]?.id,
          workdayId: workday.id,
          startAtInMinutes: 540,
          endAtInMinutes: 1020,
        },
      ],
    });
  });

  it("should throw InvalidInputError on invalid creation props", () => {
    expect(() => BarberWorkday.create({ barberId: "", weekday: 1 })).toThrow(
      InvalidInputError
    );
    expect(() =>
      BarberWorkday.create({ barberId: "barber", weekday: -1 })
    ).toThrow(InvalidInputError);
    expect(() =>
      BarberWorkday.create({ barberId: "barber", weekday: 7 })
    ).toThrow(InvalidInputError);
  });

  it("should throw InvalidInputError on invalid restore props", () => {
    const invalidProps = { id: "", barberId: "barber", weekday: 1, shifts: [] };
    expect(() => BarberWorkday.from(invalidProps)).toThrow(InvalidInputError);
  });
});
