import { describe, expect, it } from "vitest";
import { BarberFactory } from "./barber.factory";

describe("BarberFactory", () => {
  it("should create a barber with empty workdays", () => {
    const barber = BarberFactory.createWithEmptyWorkdays("barber-1");

    expect(barber.id).toBe("barber-1");
    expect(barber.workdays.length).toBe(0);
  });

  it("should create a barber with 7 full-day workdays", () => {
    const barber = BarberFactory.createWithWorkdaysAndShifts({
      barberId: "barber-2",
    });

    expect(barber.workdays.length).toBe(7);
    barber.workdays.forEach((wd, i) => {
      expect(wd.weekday).toBe(i);
      expect(wd.shifts.length).toBe(1);
      expect(wd.shifts[0]?.startAtInMinutes).toBe(480); // 8:00
      expect(wd.shifts[0]?.endAtInMinutes).toBe(1080); // 18:00
    });
  });

  it("should create a barber with random multiple shifts per day", () => {
    const barber = BarberFactory.createWithRandomShifts("barber-3", 3);

    expect(barber.workdays.length).toBe(7);
    barber.workdays.forEach((wd) => {
      expect(wd.shifts.length).toBe(3);
      wd.shifts.forEach((shift, j) => {
        const expectedStart = 480 + j * 120;
        expect(shift.startAtInMinutes).toBe(expectedStart);
        expect(shift.endAtInMinutes).toBe(expectedStart + 90);
      });
    });
  });

  it("should create a barber with selected weekdays", () => {
    const weekdays = [1, 3, 5];
    const barber = BarberFactory.createWithSelectedWeekdays(
      "barber-4",
      weekdays
    );

    expect(barber.workdays.length).toBe(3);
    barber.workdays.forEach((wd, i) => {
      expect(wd.weekday).toBe(weekdays[i]);
      expect(wd.shifts.length).toBe(1);
    });
  });

  it("should create a barber with workday gaps", () => {
    const barber = BarberFactory.createWithGaps("barber-5");

    expect(barber.workdays.length).toBe(1);
    const wd = barber.workdays[0];
    expect(wd?.weekday).toBe(2);
    expect(wd?.shifts.length).toBe(2);
    expect(wd?.shifts[0]?.startAtInMinutes).toBe(480);
    expect(wd?.shifts[0]?.endAtInMinutes).toBe(720);
    expect(wd?.shifts[1]?.startAtInMinutes).toBe(840);
    expect(wd?.shifts[1]?.endAtInMinutes).toBe(1080);
  });

  it("should create a barber with a single shift", () => {
    const barber = BarberFactory.createWithSingleShift("barber-6");

    expect(barber.workdays.length).toBe(1);
    const wd = barber.workdays[0];
    expect(wd?.weekday).toBe(5);
    expect(wd?.shifts.length).toBe(1);
    expect(wd?.shifts[0]?.startAtInMinutes).toBe(540); // 9:00
    expect(wd?.shifts[0]?.endAtInMinutes).toBe(1020); // 17:00
  });
});
