import { describe, expect, it } from "vitest";
import { InvalidInputError } from "../errors/shared";
import { BarberWorkdayShift } from "./barber-workday-shift";

describe("BarberWorkdayShift Entity", () => {
  it("should create a shift properly", () => {
    const shift = BarberWorkdayShift.create({
      workdayId: "workday-123",
      startAtInMinutes: 480, // 08:00
      endAtInMinutes: 1020, // 17:00
    });

    expect(shift.id).toBeDefined();
    expect(shift.workdayId).toBe("workday-123");
    expect(shift.startAtInMinutes).toBe(480);
    expect(shift.endAtInMinutes).toBe(1020);
  });

  it("should restore a shift properly", () => {
    const shift = BarberWorkdayShift.from({
      id: "shift-123",
      workdayId: "workday-123",
      startAtInMinutes: 540, // 09:00
      endAtInMinutes: 1080, // 18:00
    });

    expect(shift.id).toBe("shift-123");
    expect(shift.workdayId).toBe("workday-123");
    expect(shift.startAtInMinutes).toBe(540);
    expect(shift.endAtInMinutes).toBe(1080);
  });

  it("should throw InvalidInputError for invalid creation props", () => {
    expect(() =>
      BarberWorkdayShift.create({
        workdayId: "",
        startAtInMinutes: 480,
        endAtInMinutes: 1020,
      } as any)
    ).toThrow(InvalidInputError);
    expect(() =>
      BarberWorkdayShift.create({
        workdayId: "w",
        startAtInMinutes: -1,
        endAtInMinutes: 1020,
      } as any)
    ).toThrow(InvalidInputError);
    expect(() =>
      BarberWorkdayShift.create({
        workdayId: "w",
        startAtInMinutes: 480,
        endAtInMinutes: 1441,
      } as any)
    ).toThrow(InvalidInputError);
    expect(() =>
      BarberWorkdayShift.create({
        workdayId: "w",
        startAtInMinutes: 600,
        endAtInMinutes: 500,
      } as any)
    ).toThrow(InvalidInputError);
  });

  it("should throw InvalidInputError for invalid restore props", () => {
    expect(() =>
      BarberWorkdayShift.from({
        id: "",
        workdayId: "w",
        startAtInMinutes: 480,
        endAtInMinutes: 1020,
      } as any)
    ).toThrow(InvalidInputError);
    expect(() =>
      BarberWorkdayShift.from({
        id: "s",
        workdayId: "",
        startAtInMinutes: 480,
        endAtInMinutes: 1020,
      } as any)
    ).toThrow(InvalidInputError);
    expect(() =>
      BarberWorkdayShift.from({
        id: "s",
        workdayId: "w",
        startAtInMinutes: -1,
        endAtInMinutes: 1020,
      } as any)
    ).toThrow(InvalidInputError);
    expect(() =>
      BarberWorkdayShift.from({
        id: "s",
        workdayId: "w",
        startAtInMinutes: 480,
        endAtInMinutes: 1441,
      } as any)
    ).toThrow(InvalidInputError);
    expect(() =>
      BarberWorkdayShift.from({
        id: "s",
        workdayId: "w",
        startAtInMinutes: 600,
        endAtInMinutes: 500,
      } as any)
    ).toThrow(InvalidInputError);
  });
});
