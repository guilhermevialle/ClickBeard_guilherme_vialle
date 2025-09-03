import { Barber } from "../aggregates/barber";
import { BarberWorkday } from "../entities/barber-workday";
import { BarberWorkdayShift } from "../entities/barber-workday-shift";

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
      const workday = BarberWorkday.create({ barberId: barber.id, weekday: i });

      const shift = BarberWorkdayShift.create({
        workdayId: workday.id,
        startAtInMinutes: 8 * 60,
        endAtInMinutes: 18 * 60,
      });

      workday.addShift(shift);
      barber.addWorkday(workday);
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
      const workday = BarberWorkday.create({ barberId: barber.id, weekday: i });

      for (let j = 0; j < shiftsPerDay; j++) {
        const start = 8 * 60 + j * 120;
        const end = start + 90;

        const shift = BarberWorkdayShift.create({
          workdayId: workday.id,
          startAtInMinutes: start,
          endAtInMinutes: end,
        });

        workday.addShift(shift);
      }

      barber.addWorkday(workday);
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
      const workday = BarberWorkday.create({
        barberId: barber.id,
        weekday: day,
      });
      barber.addWorkday(workday);
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

    const workday = BarberWorkday.create({ barberId: barber.id, weekday: 2 });

    const morningShift = BarberWorkdayShift.create({
      workdayId: workday.id,
      startAtInMinutes: 8 * 60,
      endAtInMinutes: 12 * 60,
    });

    const eveningShift = BarberWorkdayShift.create({
      workdayId: workday.id,
      startAtInMinutes: 14 * 60,
      endAtInMinutes: 18 * 60,
    });

    workday.addShift(morningShift);
    workday.addShift(eveningShift);

    barber.addWorkday(workday);

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

    const workday = BarberWorkday.create({ barberId: barber.id, weekday: 5 });
    const shift = BarberWorkdayShift.create({
      workdayId: workday.id,
      startAtInMinutes: 9 * 60,
      endAtInMinutes: 17 * 60,
    });

    workday.addShift(shift);

    barber.addWorkday(workday);

    return barber;
  }
}
