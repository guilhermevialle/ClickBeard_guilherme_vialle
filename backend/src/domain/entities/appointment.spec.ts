import { addMinutes } from "date-fns";
import { describe, expect, it } from "vitest";
import { InvalidInputError } from "../errors/shared";
import { Appointment } from "./appointment";

describe("Appointment Entity", () => {
  const futureDate = addMinutes(new Date(), 10);
  const pastDate = addMinutes(new Date(), -10);

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
    updatedAt: new Date(),
  };

  const expectAppointmentProps = (appointment: Appointment, props: any) => {
    Object.entries(props).forEach(([key, value]) => {
      // @ts-expect-error
      expect(appointment[key]).toEqual(value);
    });
  };

  it("should create an appointment properly", () => {
    const appointment = Appointment.create(validCreateProps);
    expect(appointment.id).toBeDefined();
    expectAppointmentProps(appointment, validCreateProps);
    expect(appointment.createdAt).toBeInstanceOf(Date);
    expect(appointment.updatedAt).toBeInstanceOf(Date);
  });

  it("should restore an appointment properly", () => {
    const appointment = Appointment.from(validRestoreProps);
    expectAppointmentProps(appointment, validRestoreProps);
  });

  const invalidCreatePropsList = [
    { ...validCreateProps, customerId: "" },
    { ...validCreateProps, barberId: "" },
    { ...validCreateProps, specialtyId: "" },
    { ...validCreateProps, durationInMinutes: -1 },
    { ...validCreateProps, startAt: pastDate },
  ];

  it("should throw InvalidInputError for invalid creation props", () => {
    invalidCreatePropsList.forEach((props) => {
      expect(() => Appointment.create(props as any)).toThrow(InvalidInputError);
    });
  });

  const invalidRestorePropsList = [
    { ...validRestoreProps, id: "" },
    { ...validRestoreProps, customerId: "" },
    { ...validRestoreProps, barberId: "" },
    { ...validRestoreProps, specialtyId: "" },
    { ...validRestoreProps, durationInMinutes: -5 },
    { ...validRestoreProps, startAt: pastDate },
  ];

  it("should throw InvalidInputError for invalid restore props", () => {
    invalidRestorePropsList.forEach((props) => {
      expect(() => Appointment.from(props as any)).toThrow(InvalidInputError);
    });
  });
});
