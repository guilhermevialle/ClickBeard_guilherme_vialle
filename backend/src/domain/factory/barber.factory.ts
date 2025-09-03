import { Barber } from "../aggregates/barber";

export class BarberFactory {
  static createWithEmptyWorkdays(barberId: string) {
    return Barber.from({
      id: barberId,
      name: "John Doe",
      age: 20,
      hiredAt: new Date("2000-01-01"),
      workdays: [],
    });
  }

  static createWithWorkdaysAndShifts(barberId: string) {
    const barber = Barber.from({
      id: barberId,
      name: "John Doe",
      age: 20,
      hiredAt: new Date("2000-01-01"),
      workdays: [],
    });

    for (let i = 0; i < 7; i++) {
      barber.addWorkdayWithShifts(i, [
        { startAtInMinutes: 8 * 60, endAtInMinutes: 18 * 60 },
      ]);
    }

    return barber;
  }

  static createWithRandomShifts(barberId: string, shiftsPerDay = 2) {
    const barber = Barber.from({
      id: barberId,
      name: "Random Barber",
      age: 25,
      hiredAt: new Date(),
      workdays: [],
    });

    for (let i = 0; i < 7; i++) {
      const shifts = Array.from({ length: shiftsPerDay }).map((_, j) => {
        const start = 8 * 60 + j * 120;
        return { startAtInMinutes: start, endAtInMinutes: start + 90 };
      });

      barber.addWorkdayWithShifts(i, shifts);
    }

    return barber;
  }

  static createWithSelectedWeekdays(barberId: string, weekdays: number[]) {
    const barber = Barber.from({
      id: barberId,
      name: "Weekday Barber",
      age: 30,
      hiredAt: new Date(),
      workdays: [],
    });

    weekdays.forEach((day) => {
      barber.addWorkdayWithShifts(day, [
        { startAtInMinutes: 8 * 60, endAtInMinutes: 18 * 60 },
      ]);
    });

    return barber;
  }

  static createWithGaps(barberId: string) {
    const barber = Barber.from({
      id: barberId,
      name: "Gaps Barber",
      age: 32,
      hiredAt: new Date(),
      workdays: [],
    });

    barber.addWorkdayWithShifts(2, [
      { startAtInMinutes: 8 * 60, endAtInMinutes: 12 * 60 },
      { startAtInMinutes: 14 * 60, endAtInMinutes: 18 * 60 },
    ]);

    return barber;
  }

  static createWithSingleShift(barberId: string) {
    const barber = Barber.from({
      id: barberId,
      name: "Single Shift Barber",
      age: 40,
      hiredAt: new Date(),
      workdays: [],
    });

    barber.addWorkdayWithShifts(5, [
      { startAtInMinutes: 9 * 60, endAtInMinutes: 17 * 60 },
    ]);

    return barber;
  }
}
