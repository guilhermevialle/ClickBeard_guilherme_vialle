import "reflect-metadata";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import type { IAppointmentRepository } from "../../infra/interfaces/repositories/appointment-repository.interface";
import type { IBarberRepository } from "../../infra/interfaces/repositories/barber-repository.interface";
import type { ISpecialtyRepository } from "../../infra/interfaces/repositories/specialty-repository.interface";
import { GetCustomerAppointmentsBff } from "./get-customer-appointments-bff";

describe("GetCustomerAppointmentsBff Use-Case", () => {
  let appointmentRepoMock: Mocked<IAppointmentRepository>;
  let barberRepoMock: Mocked<IBarberRepository>;
  let specialtyRepoMock: Mocked<ISpecialtyRepository>;
  let getCustomerAppointments: GetCustomerAppointmentsBff;

  beforeEach(() => {
    appointmentRepoMock = {
      findByCustomerId: vi.fn(),
    } as unknown as Mocked<IAppointmentRepository>;
    barberRepoMock = {
      findById: vi.fn(),
    } as unknown as Mocked<IBarberRepository>;
    specialtyRepoMock = {
      findById: vi.fn(),
    } as unknown as Mocked<ISpecialtyRepository>;

    getCustomerAppointments = new GetCustomerAppointmentsBff(
      appointmentRepoMock,
      barberRepoMock,
      specialtyRepoMock
    );
  });

  it("should return customer's appointments with barber and specialty info", async () => {
    const customerId = "c-1";
    const mockAppointment = {
      id: "a-1",
      barberId: "b-1",
      specialtyId: "s-1",
      startAt: new Date("2025-09-05T10:00:00Z"),
      durationInMinutes: 30,
      status: "CONFIRMED" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockBarber = { id: "b-1", name: "John" };
    const mockSpecialty = { id: "s-1", name: "Haircut" };

    appointmentRepoMock.findByCustomerId.mockResolvedValue([
      mockAppointment as any,
    ]);
    barberRepoMock.findById.mockResolvedValue(mockBarber as any);
    specialtyRepoMock.findById.mockResolvedValue(mockSpecialty as any);

    const result = await getCustomerAppointments.execute({ customerId });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "a-1",
      barber: { id: "b-1", name: "John" },
      specialty: { id: "s-1", name: "Haircut" },
      durationInMinutes: 30,
      status: "CONFIRMED",
      startAt: mockAppointment.startAt,
    });

    expect(appointmentRepoMock.findByCustomerId).toHaveBeenCalledWith(
      customerId
    );
    expect(barberRepoMock.findById).toHaveBeenCalledWith("b-1");
    expect(specialtyRepoMock.findById).toHaveBeenCalledWith("s-1");
  });
});
