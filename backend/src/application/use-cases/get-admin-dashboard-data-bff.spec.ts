import "reflect-metadata";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import type { IAppointmentRepository } from "../../infra/interfaces/repositories/appointment-repository.interface";
import type { IBarberRepository } from "../../infra/interfaces/repositories/barber-repository.interface";
import type { ICustomerRepository } from "../../infra/interfaces/repositories/customer-repository.interface";
import type { ISpecialtyRepository } from "../../infra/interfaces/repositories/specialty-repository.interface";
import { GetAdminDashboardDataBff } from "./get-admin-dashboard-data-bff";

describe("GetAdminDashboardDataBff Use-Case", () => {
  let appointmentRepoMock: Mocked<IAppointmentRepository>;
  let barberRepoMock: Mocked<IBarberRepository>;
  let customerRepoMock: Mocked<ICustomerRepository>;
  let specialtyRepoMock: Mocked<ISpecialtyRepository>;
  let getDashboard: GetAdminDashboardDataBff;

  beforeEach(() => {
    appointmentRepoMock = {
      findAll: vi.fn(),
    } as unknown as Mocked<IAppointmentRepository>;
    barberRepoMock = {
      findById: vi.fn(),
    } as unknown as Mocked<IBarberRepository>;
    customerRepoMock = {
      findById: vi.fn(),
    } as unknown as Mocked<ICustomerRepository>;
    specialtyRepoMock = {
      findById: vi.fn(),
    } as unknown as Mocked<ISpecialtyRepository>;

    getDashboard = new GetAdminDashboardDataBff(
      customerRepoMock,
      barberRepoMock,
      appointmentRepoMock,
      specialtyRepoMock
    );
  });

  it("should return dashboard data for appointments on the given date", async () => {
    const date = new Date("2025-09-05T10:00:00Z");

    const appointment = {
      id: "a-1",
      barberId: "b-1",
      customerId: "c-1",
      specialtyId: "s-1",
      durationInMinutes: 30,
      status: "CONFIRMED" as const,
      startAt: date,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    appointmentRepoMock.findAll.mockResolvedValue([appointment as any]);
    barberRepoMock.findById.mockResolvedValue({
      id: "b-1",
      name: "John",
    } as any);
    customerRepoMock.findById.mockResolvedValue({
      id: "c-1",
      name: "Alice",
    } as any);
    specialtyRepoMock.findById.mockResolvedValue({
      id: "s-1",
      name: "Haircut",
    } as any);

    const result = await getDashboard.execute({ date });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "a-1",
      barberName: "John",
      customerName: "Alice",
      specialtyName: "Haircut",
      durationInMinutes: 30,
      status: "CONFIRMED",
      startAt: date,
    });

    expect(appointmentRepoMock.findAll).toHaveBeenCalled();
    expect(barberRepoMock.findById).toHaveBeenCalledWith("b-1");
    expect(customerRepoMock.findById).toHaveBeenCalledWith("c-1");
    expect(specialtyRepoMock.findById).toHaveBeenCalledWith("s-1");
  });

  it("should throw an error if barber or customer is not found", async () => {
    const date = new Date("2025-09-05T10:00:00Z");

    const appointment = {
      id: "a-1",
      barberId: "b-1",
      customerId: "c-1",
      specialtyId: "s-1",
      durationInMinutes: 30,
      status: "CONFIRMED" as const,
      startAt: date,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    appointmentRepoMock.findAll.mockResolvedValue([appointment as any]);
    barberRepoMock.findById.mockResolvedValue(null);
    customerRepoMock.findById.mockResolvedValue({
      id: "c-1",
      name: "Alice",
    } as any);

    await expect(getDashboard.execute({ date })).rejects.toThrow(
      "Barber or Customer not found"
    );
  });
});
