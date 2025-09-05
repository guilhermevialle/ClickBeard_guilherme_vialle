import "reflect-metadata";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { IAppointmentRepository } from "../../infra/interfaces/repositories/appointment-repository.interface";
import { AppointmentNotFoundError } from "../errors/shared";
import { CancelAppointment } from "./cancel-appointment";

describe("CancelAppointment Use-Case", () => {
  let appointmentRepoMock: Mocked<IAppointmentRepository>;
  let cancelAppointment: CancelAppointment;

  beforeEach(() => {
    appointmentRepoMock = {
      findById: vi.fn(),
      update: vi.fn(),
    } as unknown as Mocked<IAppointmentRepository>;

    cancelAppointment = new CancelAppointment(appointmentRepoMock);
  });

  it("should throw AppointmentNotFoundError if appointment does not exist", async () => {
    appointmentRepoMock.findById.mockResolvedValue(null);

    await expect(
      cancelAppointment.execute({ id: "non-existent-id" })
    ).rejects.toThrow(AppointmentNotFoundError);

    expect(appointmentRepoMock.findById).toHaveBeenCalledWith(
      "non-existent-id"
    );
    expect(appointmentRepoMock.update).not.toHaveBeenCalled();
  });

  it("should cancel and update the appointment if it exists", async () => {
    const appointmentMock = { cancel: vi.fn() };

    appointmentRepoMock.findById.mockResolvedValue(appointmentMock as any);

    await cancelAppointment.execute({ id: "existing-id" });

    expect(appointmentMock.cancel).toHaveBeenCalled();
    expect(appointmentRepoMock.update).toHaveBeenCalledWith(appointmentMock);
  });
});
