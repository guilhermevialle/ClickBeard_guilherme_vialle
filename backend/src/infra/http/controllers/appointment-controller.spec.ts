import { addDays } from "date-fns";
import "reflect-metadata";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { BadRequestError } from "../../../application/errors/shared";
import type { CancelAppointment } from "../../../application/use-cases/cancel-appointment";
import type { CreateAppointment } from "../../../application/use-cases/create-appointment";
import type { GetCustomerAppointmentsBff } from "../../../application/use-cases/get-customer-appointments-bff";
import { AppointmentController } from "./appointment.controller";

describe("AppointmentController", () => {
  let createAppointmentMock: Mocked<CreateAppointment>;
  let getCustomerAppointmentsBffMock: Mocked<GetCustomerAppointmentsBff>;
  let cancelAppointmentMock: Mocked<CancelAppointment>;
  let controller: AppointmentController;
  let replyMock: any;

  beforeEach(() => {
    createAppointmentMock = {
      execute: vi.fn(),
    } as unknown as Mocked<CreateAppointment>;
    getCustomerAppointmentsBffMock = {
      execute: vi.fn(),
    } as unknown as Mocked<GetCustomerAppointmentsBff>;
    cancelAppointmentMock = {
      execute: vi.fn(),
    } as unknown as Mocked<CancelAppointment>;

    controller = new AppointmentController(
      createAppointmentMock,
      getCustomerAppointmentsBffMock,
      cancelAppointmentMock
    );

    replyMock = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  it("should cancel an appointment and return 204", async () => {
    const request = { params: { id: "a-1" } };

    await controller.cancel(request as any, replyMock);

    expect(cancelAppointmentMock.execute).toHaveBeenCalledWith({ id: "a-1" });
    expect(replyMock.status).toHaveBeenCalledWith(204);
    expect(replyMock.send).toHaveBeenCalledWith({
      statusCode: 204,
      message: "Appointment canceled!",
    });
  });

  it("should get all appointments by customer ID", async () => {
    const appointmentsMock = [{ id: "a-1" }];
    getCustomerAppointmentsBffMock.execute.mockResolvedValue(
      appointmentsMock as any
    );

    const request = { userId: "c-1" };
    await controller.getAllByCustomerId(request as any, replyMock);

    expect(getCustomerAppointmentsBffMock.execute).toHaveBeenCalledWith({
      customerId: "c-1",
    });
    expect(replyMock.status).toHaveBeenCalledWith(200);
    expect(replyMock.send).toHaveBeenCalledWith(appointmentsMock);
  });

  it("should create an appointment and return 201", async () => {
    const appointmentMock = { toJSON: vi.fn().mockReturnValue({ id: "a-1" }) };
    createAppointmentMock.execute.mockResolvedValue(appointmentMock as any);

    const request = {
      body: {
        barberId: "b-1",
        specialtyId: "s-1",
        startAt: addDays(new Date(), 1),
      },
      userId: "c-1",
    };

    await controller.create(request as any, replyMock);

    expect(createAppointmentMock.execute).toHaveBeenCalled();
    expect(appointmentMock.toJSON).toHaveBeenCalled();
    expect(replyMock.status).toHaveBeenCalledWith(201);
    expect(replyMock.send).toHaveBeenCalledWith({ id: "a-1" });
  });

  it("should throw BadRequestError if validation fails", async () => {
    const request = { body: {}, userId: "c-1" };

    await expect(controller.create(request as any, replyMock)).rejects.toThrow(
      BadRequestError
    );
  });
});
