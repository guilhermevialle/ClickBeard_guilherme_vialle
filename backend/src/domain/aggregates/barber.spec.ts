import { describe, expect, it } from "vitest";
import { Barber } from "../aggregates/barber";

describe("Barber Entity", () => {
  it("should create a Barber correctly", () => {
    const barber = Barber.create({
      name: "John Doe",
      age: 25,
      hiredAt: new Date("2025-01-01"),
    });

    expect(barber.id).toBeDefined();
    expect(barber.name).toBe("John Doe");
    expect(barber.age).toBe(25);
    expect(barber.hiredAt).toEqual(new Date("2025-01-01"));
    expect(barber.workdays.length).toBe(0);
  });

  it("should add workday with shifts", () => {
    const barber = Barber.create({
      name: "John Doe",
      age: 25,
      hiredAt: new Date(),
    });

    barber.addWorkdayWithShifts(1, [
      { startAtInMinutes: 8 * 60, endAtInMinutes: 12 * 60 },
      { startAtInMinutes: 13 * 60, endAtInMinutes: 17 * 60 },
    ]);

    expect(barber.workdays.length).toBe(1);
    const workday = barber.workdays[0];
    expect(workday?.weekday).toBe(1);
    expect(workday?.shifts.length).toBe(2);
    expect(workday?.shifts[0]?.startAtInMinutes).toBe(480);
    expect(workday?.shifts[1]?.endAtInMinutes).toBe(1020);
  });

  it("should check if barber is working at a given day", () => {
    const barber = Barber.create({
      name: "John Doe",
      age: 25,
      hiredAt: new Date(),
    });

    expect(barber.isWorkingAtDay(1)).toBe(false);

    barber.addWorkdayWithShifts(1, [
      { startAtInMinutes: 9 * 60, endAtInMinutes: 17 * 60 },
    ]);
    expect(barber.isWorkingAtDay(1)).toBe(true);
  });

  it("should remove a workday", () => {
    const barber = Barber.create({
      name: "John Doe",
      age: 25,
      hiredAt: new Date(),
    });

    barber.addWorkdayWithShifts(2, [
      { startAtInMinutes: 8 * 60, endAtInMinutes: 16 * 60 },
    ]);
    expect(barber.workdays.length).toBe(1);

    barber.removeWorkday(2);
    expect(barber.workdays.length).toBe(0);
  });

  it("should correctly serialize to JSON", () => {
    const barber = Barber.create({
      name: "John Doe",
      age: 25,
      hiredAt: new Date("2025-01-01"),
    });

    barber.addWorkdayWithShifts(0, [
      { startAtInMinutes: 8 * 60, endAtInMinutes: 16 * 60 },
    ]);
    const json = barber.toJSON();

    expect(json.id).toBe(barber.id);
    expect(json.workdays.length).toBe(1);
    expect(json.workdays[0]?.shifts.length).toBe(1);
  });
});
