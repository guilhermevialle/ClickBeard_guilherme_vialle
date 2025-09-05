import {
  addMinutes,
  areIntervalsOverlapping,
  getDay,
  isSameDay,
  startOfDay,
} from "date-fns";
import { inject, injectable } from "tsyringe";
import { BarberNotFoundError } from "../../application/errors/shared";
import type { IAppointmentRepository } from "../interfaces/repositories/appointment-repository.interface";
import type { IBarberRepository } from "../interfaces/repositories/barber-repository.interface";
import { IBarberAvailabilityService } from "../interfaces/services/barber-availability-service.interface";

const SLOT_STEP_MINUTES = 30;

@injectable()
export class BarberAvailabilityService implements IBarberAvailabilityService {
  constructor(
    @inject("AppointmentRepository")
    private readonly appointmentRepo: IAppointmentRepository,
    @inject("BarberRepository")
    private readonly barberRepo: IBarberRepository
  ) {}

  async isSlotAvailable(barberId: string, startAt: Date): Promise<boolean> {
    const barber = await this.barberRepo.findById(barberId);
    if (!barber)
      throw new BarberNotFoundError(`Barber with id ${barberId} not found`);

    const weekday = getDay(startAt);
    const workday = barber.workdays.find((wd) => wd.weekday === weekday);

    if (!workday) return false;

    const slotMinutes = startAt.getHours() * 60 + startAt.getMinutes();
    const inShift = workday.shifts.some(
      (shift) =>
        slotMinutes >= shift.startAtInMinutes &&
        slotMinutes + SLOT_STEP_MINUTES <= shift.endAtInMinutes
    );

    if (!inShift) return false;

    const dayAppointments = (
      await this.appointmentRepo.findByBarberId(barberId)
    ).filter(
      (a) =>
        isSameDay(a.startAt, startAt) &&
        !a.wasFinished &&
        a.status === "CONFIRMED"
    );

    const end = addMinutes(startAt, SLOT_STEP_MINUTES);

    const conflict = dayAppointments.some((a) =>
      areIntervalsOverlapping(
        { start: startAt, end },
        { start: a.startAt, end: a.endAt }
      )
    );

    return !conflict;
  }

  async findAvailableSlotsByBarberIdAndDate(
    barberId: string,
    date: Date
  ): Promise<number[]> {
    const barber = await this.barberRepo.findById(barberId);
    if (!barber)
      throw new BarberNotFoundError(`Barber with id ${barberId} not found`);

    const weekday = getDay(date);
    const workday = barber.workdays.find((wd) => wd.weekday === weekday);
    if (!workday) return [];

    const availableSlots = workday.shifts.flatMap((shift) =>
      Array.from(
        {
          length: Math.floor(
            (shift.endAtInMinutes - shift.startAtInMinutes) / SLOT_STEP_MINUTES
          ),
        },
        (_, i) => shift.startAtInMinutes + i * SLOT_STEP_MINUTES
      )
    );

    const dayAppointments = (
      await this.appointmentRepo.findByBarberId(barberId)
    ).filter(
      (a) =>
        isSameDay(a.startAt, date) && !a.wasFinished && a.status === "CONFIRMED"
    );

    const freeSlots = availableSlots.filter((minutes) => {
      const start = addMinutes(startOfDay(date), minutes);
      const end = addMinutes(start, SLOT_STEP_MINUTES);

      return !dayAppointments.some((appointment) =>
        areIntervalsOverlapping(
          { start, end },
          { start: appointment.startAt, end: appointment.endAt }
        )
      );
    });

    return freeSlots;
  }
}
