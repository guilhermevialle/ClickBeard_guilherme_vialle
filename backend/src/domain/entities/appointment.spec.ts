import { addMinutes } from "date-fns";
import { describe, expect, it } from "vitest";
import { Appointment } from "./appointment";

describe("Appointment Entity", () => {
  const now = new Date();
  const futureDate = addMinutes(now, 10);
  const pastDate = addMinutes(now, -10);

  const validCreateProps = {
    customerId: "customer-123",
    barberId: "barber-123",
    specialtyId: "specialty-123",
    durationInMinutes: 30,
    startAt: futureDate,
  };

  const validRestoreProps = {
    id: "appt-123",
    ...validCreateProps,
    durationInMinutes: 45,
    createdAt: new Date(),
    status: "CONFIRMED",
    startAt: futureDate,
    updatedAt: new Date(),
  };

  const expectAppointmentProps = (appointment: Appointment, props: any) => {
    for (const [key, value] of Object.entries(props)) {
      // @ts-expect-error access private props
      expect(appointment[key]).toEqual(value);
    }
  };

  describe("isOverlapping", () => {
    const setupPair = (
      offset1: number,
      duration1: number,
      offset2: number,
      duration2: number
    ) => {
      const base = addMinutes(new Date(), 5);
      const a1 = Appointment.create({
        ...validCreateProps,
        startAt: addMinutes(base, offset1),
        durationInMinutes: duration1,
      });
      const a2 = Appointment.create({
        ...validCreateProps,
        startAt: addMinutes(base, offset2),
        durationInMinutes: duration2,
      });
      return [a1, a2] as const;
    };

    const toRange = (appt: Appointment) => ({
      startAt: appt.startAt,
      endAt: addMinutes(appt.startAt, appt.durationInMinutes),
    });

    it("should detect overlapping appointments (exclusive)", () => {
      const [a1, a2] = setupPair(0, 30, 15, 30);
      expect(a1.isOverlapping(toRange(a2))).toBe(true);
      expect(a2.isOverlapping(toRange(a1))).toBe(true);
    });

    it("should detect non-overlapping appointments (exclusive)", () => {
      const [a1, a2] = setupPair(0, 30, 30, 30);
      expect(a1.isOverlapping(toRange(a2))).toBe(false);
      expect(a2.isOverlapping(toRange(a1))).toBe(false);
    });

    it("should detect touching appointments as overlapping when inclusive = true", () => {
      const [a1, a2] = setupPair(0, 30, 30, 30);
      expect(a1.isOverlapping(toRange(a2), true)).toBe(true);
      expect(a2.isOverlapping(toRange(a1), true)).toBe(true);
    });

    it("should not detect overlap for distant appointments", () => {
      const [a1, a2] = setupPair(0, 30, 60, 30);
      expect(a1.isOverlapping(toRange(a2))).toBe(false);
      expect(a2.isOverlapping(toRange(a1))).toBe(false);
    });
  });

  it("should create an appointment properly", () => {
    const appointment = Appointment.create(validCreateProps);
    expect(appointment.id).toBeDefined();
    expectAppointmentProps(appointment, validCreateProps);
    expect(appointment.createdAt).toBeInstanceOf(Date);
    expect(appointment.updatedAt).toBeInstanceOf(Date);
  });
});
