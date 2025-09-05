import "reflect-metadata";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { Appointment } from "../../domain/entities/appointment";
import type { IAppointmentRepository } from "../../infra/interfaces/repositories/appointment-repository.interface";
import type { ICustomerRepository } from "../../infra/interfaces/repositories/customer-repository.interface";
import type { IBarberAvailabilityService } from "../../infra/interfaces/services/barber-availability-service.interface";
import {
  BarberNotAvailableError,
  CustomerNotFoundError,
  PendingAppointmentError,
} from "../errors/shared";
import { CreateAppointment } from "./create-appointment";

describe("CreateAppointment Use-Case", () => {
  let appointmentRepoMock: Mocked<IAppointmentRepository>;
  let customerRepoMock: Mocked<ICustomerRepository>;
  let barberAvailabilityMock: Mocked<IBarberAvailabilityService>;
  let createAppointment: CreateAppointment;

  beforeEach(() => {
    appointmentRepoMock = {
      findByCustomerId: vi.fn(),
      save: vi.fn(),
    } as unknown as Mocked<IAppointmentRepository>;

    customerRepoMock = {
      findById: vi.fn(),
    } as unknown as Mocked<ICustomerRepository>;

    barberAvailabilityMock = {
      isSlotAvailable: vi.fn(),
    } as unknown as Mocked<IBarberAvailabilityService>;

    createAppointment = new CreateAppointment(
      appointmentRepoMock,
      customerRepoMock,
      barberAvailabilityMock
    );
  });

  it("should throw CustomerNotFoundError if customer does not exist", async () => {
    customerRepoMock.findById.mockResolvedValue(null);

    await expect(
      createAppointment.execute({
        customerId: "c-1",
        barberId: "b-1",
        specialtyId: "s-1",
        startAt: new Date(),
      })
    ).rejects.toThrow(CustomerNotFoundError);
  });

  it("should throw BarberNotAvailableError if slot is taken", async () => {
    customerRepoMock.findById.mockResolvedValue({ id: "c-1" } as any);
    barberAvailabilityMock.isSlotAvailable.mockResolvedValue(false);

    await expect(
      createAppointment.execute({
        customerId: "c-1",
        barberId: "b-1",
        specialtyId: "s-1",
        startAt: new Date(),
      })
    ).rejects.toThrow(BarberNotAvailableError);
  });

  it("should throw PendingAppointmentError if customer has active appointment", async () => {
    customerRepoMock.findById.mockResolvedValue({ id: "c-1" } as any);
    barberAvailabilityMock.isSlotAvailable.mockResolvedValue(true);
    appointmentRepoMock.findByCustomerId.mockResolvedValue([
      { wasFinished: false, status: "CONFIRMED" },
    ] as any);

    await expect(
      createAppointment.execute({
        customerId: "c-1",
        barberId: "b-1",
        specialtyId: "s-1",
        startAt: new Date(),
      })
    ).rejects.toThrow(PendingAppointmentError);
  });

  it("should create and save a new appointment when valid", async () => {
    const startAt = new Date();
    customerRepoMock.findById.mockResolvedValue({ id: "c-1" } as any);
    barberAvailabilityMock.isSlotAvailable.mockResolvedValue(true);
    appointmentRepoMock.findByCustomerId.mockResolvedValue([]);

    const appointment = await createAppointment.execute({
      customerId: "c-1",
      barberId: "b-1",
      specialtyId: "s-1",
      startAt,
    });

    expect(appointment).toBeInstanceOf(Appointment);
    expect(appointmentRepoMock.save).toHaveBeenCalledWith(appointment);
  });
});
