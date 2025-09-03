import { describe, expect, it } from "vitest";
import { InvalidInputError } from "../errors/shared";
import { Appointment } from "./appointment";

describe("Appointment Entity", () => {
  it("should create an appointment properly", () => {
    const appointment = Appointment.create({
      customerId: "customer-123",
      barberId: "barber-456",
      specialtyId: "specialty-789",
    });

    expect(appointment.id).toBeDefined();
    expect(appointment.customerId).toBe("customer-123");
    expect(appointment.barberId).toBe("barber-456");
    expect(appointment.specialtyId).toBe("specialty-789");
    expect(appointment.createdAt).toBeInstanceOf(Date);
    expect(appointment.updatedAt).toBeInstanceOf(Date);
  });

  it("should restore an appointment properly", () => {
    const createdAt = new Date("2025-01-01");
    const updatedAt = new Date("2025-01-02");

    const appointment = Appointment.from({
      id: "appointment-123",
      customerId: "customer-123",
      barberId: "barber-456",
      specialtyId: "specialty-789",
      createdAt,
      updatedAt,
    });

    expect(appointment.id).toBe("appointment-123");
    expect(appointment.customerId).toBe("customer-123");
    expect(appointment.barberId).toBe("barber-456");
    expect(appointment.specialtyId).toBe("specialty-789");
    expect(appointment.createdAt).toEqual(createdAt);
    expect(appointment.updatedAt).toEqual(updatedAt);
  });

  it("should throw BadRequestError when creating with invalid props", () => {
    expect(() =>
      Appointment.create({
        barberId: "",
        specialtyId: "",
      } as any)
    ).toThrow(InvalidInputError);
    expect(() =>
      Appointment.from({
        id: "appointment-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
    ).toThrow(InvalidInputError);
  });
  expect(() =>
    Appointment.from({
      customerId: "customer-123",
      barberId: "barber-456",
      specialtyId: "specialty-789",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)
  ).toThrow(InvalidInputError);
});
