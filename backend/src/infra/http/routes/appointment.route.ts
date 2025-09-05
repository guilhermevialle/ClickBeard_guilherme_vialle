import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { CancelAppointment } from "../../../application/use-cases/cancel-appointment";
import { CreateAppointment } from "../../../application/use-cases/create-appointment";
import { GetCustomerAppointmentsBff } from "../../../application/use-cases/get-customer-appointments-bff";
import { AppointmentController } from "../controllers/appointment.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const createAppointmentSwaggerSchema = {
  description: "Create an appointment",
  tags: ["appointments"],
  body: {
    type: "object",
    required: ["barberId", "specialtyId", "startAt"],
    properties: {
      barberId: { type: "string" },
      specialtyId: { type: "string" },
      startAt: { type: "string", format: "date-time" },
    },
  },
  headers: {
    type: "object",
    required: ["Authorization"],
    properties: {
      Authorization: { type: "string" },
    },
  },
  response: {
    401: {
      description: "Missing token or invalid token",
      type: "object",
      properties: {
        message: { type: "string", example: "Invalid token or missing token." },
        errorCode: { type: "string", example: "UNAUTHORIZED" },
        statusCode: { type: "integer", example: 401 },
      },
    },
    404: {
      description: "Data not found",
      type: "object",
      properties: {
        message: { type: "string", example: "Barber not found." },
        errorCode: { type: "string", example: "BARBER_NOT_FOUND" },
        statusCode: { type: "integer", example: 404 },
      },
    },
    409: {
      description: "Active appointment already exists",
      type: "object",
      properties: {
        message: { type: "string", example: "Appointment already exists." },
        errorCode: { type: "string", example: "PENDING_APPOINTMENT" },
        statusCode: { type: "integer", example: 409 },
      },
    },
    201: {
      description: "Appointment created successfully!",
      type: "object",
      properties: {
        id: { type: "string", example: "appointment-1" },
        customerId: { type: "string", example: "customer-1" },
        barberId: { type: "string", example: "barber-1" },
        specialtyId: { type: "string", example: "specialty-1" },
        durationInMinutes: { type: "number", example: 30 },
        status: { type: "string", example: "CONFIRMED" },
        startAt: {
          type: "string",
          format: "date-time",
          example: "2023-09-05T08:00:00Z",
        },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2023-09-05T08:00:00Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          example: "2023-09-05T08:00:00Z",
        },
      },
    },
  },
};

const getAllByCustomerIdSwaggerSchema = {
  description: "Get all appointments by customer",
  tags: ["appointments"],
  headers: {
    type: "object",
    required: ["Authorization"],
    properties: {
      Authorization: { type: "string" },
    },
  },
  response: {
    401: {
      description: "Missing token or invalid token",
      type: "object",
      properties: {
        message: { type: "string", example: "Invalid token or missing token." },
        errorCode: { type: "string", example: "UNAUTHORIZED" },
        statusCode: { type: "integer", example: 401 },
      },
    },
    200: {
      description: "List of customer appointments",
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", example: "appointment-1" },
          barber: {
            type: "object",
            properties: {
              id: { type: "string", example: "barber-1" },
              name: { type: "string", example: "John Doe" },
            },
          },
          specialty: {
            type: "object",
            properties: {
              id: { type: "string", example: "specialty-1" },
              name: { type: "string", example: "Haircut" },
            },
          },
          startAt: {
            type: "string",
            format: "date-time",
            example: "2023-09-05T08:00:00Z",
          },
          durationInMinutes: { type: "number", example: 30 },
          status: { type: "string", example: "CONFIRMED" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-09-05T08:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-09-05T08:00:00Z",
          },
        },
      },
    },
  },
};

const cancelAppointmentSwaggerSchema = {
  description: "Cancel an appointment",
  tags: ["appointments"],
  headers: {
    type: "object",
    required: ["Authorization"],
    properties: {
      Authorization: { type: "string" },
    },
  },
  response: {
    404: {
      description: "Data not found",
      type: "object",
      properties: {
        message: { type: "string", example: "Appointment not found." },
        errorCode: { type: "string", example: "APPOINTMENT_NOT_FOUND" },
        statusCode: { type: "integer", example: 404 },
      },
    },
    204: {
      description: "Appointment canceled successfully!",
      response: {
        type: "object",
        properties: {
          statusCode: { type: "integer", example: 204 },
          message: { type: "string", example: "Appointment canceled!" },
        },
      },
    },
    401: {
      description: "Missing token or invalid token",
      type: "object",
      properties: {
        message: { type: "string", example: "Invalid token or missing token." },
        errorCode: { type: "string", example: "UNAUTHORIZED" },
        statusCode: { type: "integer", example: 401 },
      },
    },
  },
};

export function appointmentRoutes(app: FastifyInstance) {
  const createAppointment =
    container.resolve<CreateAppointment>("CreateAppointment");
  const getCustomerAppointmentsBff =
    container.resolve<GetCustomerAppointmentsBff>("GetCustomerAppointmentsBff");
  const cancelAppointment =
    container.resolve<CancelAppointment>("CancelAppointment");

  const appointmentController = new AppointmentController(
    createAppointment,
    getCustomerAppointmentsBff,
    cancelAppointment
  );

  const authMiddleware = container.resolve<AuthMiddleware>("AuthMiddleware");

  app.post(
    "/appointments/new",
    {
      schema: createAppointmentSwaggerSchema,
      preHandler: authMiddleware.handle.bind(authMiddleware),
    },
    appointmentController.create.bind(appointmentController)
  );
  app.get(
    "/appointments/me",
    {
      schema: getAllByCustomerIdSwaggerSchema,
      preHandler: authMiddleware.handle.bind(authMiddleware),
    },
    appointmentController.getAllByCustomerId.bind(appointmentController)
  );
  app.patch(
    "/appointments/:id",
    {
      schema: cancelAppointmentSwaggerSchema,
      preHandler: authMiddleware.handle.bind(authMiddleware),
    },
    appointmentController.cancel.bind(appointmentController)
  );
}
