import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { CreateBarberWithSpecialties } from "../../../application/use-cases/create-barber-with-specialties";
import { FindBarberSlotsByDate } from "../../../application/use-cases/find-barber-slots-by-date";
import { GetAllBarbers } from "../../../application/use-cases/get-all-barbers";
import { GetAllBarbersForBff } from "../../../application/use-cases/get-all-barbers-for-bff";
import { BarberController } from "../controllers/barber.controller";

const createBarberSwaggerSchema = {
  description: "Create a new barber with specialties",
  tags: ["barbers"],
  body: {
    type: "object",
    required: ["name", "age", "hiredAt", "specialtyIds"],
    properties: {
      name: { type: "string" },
      age: { type: "number", minimum: 1 },
      hiredAt: { type: "string", format: "date" },
      specialtyIds: { type: "array", items: { type: "string", minLength: 1 } },
    },
  },
  response: {
    201: {
      description: "Barber created successfully!",
      type: "object",
      properties: {
        id: { type: "string", example: "123" },
        name: { type: "string", example: "John Doe" },
        age: { type: "number", example: 30 },
        hiredAt: {
          type: "string",
          format: "date-time",
          example: "2025-09-05T08:00:00Z",
        },
        workdays: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", example: "workday-1" },
              barberId: { type: "string", example: "123" },
              weekday: { type: "number", example: 1 },
              shifts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "shift-1" },
                    workdayId: { type: "string", example: "workday-1" },
                    startAtInMinutes: { type: "number", example: 480 },
                    endAtInMinutes: { type: "number", example: 1020 },
                  },
                },
              },
            },
            example: {
              id: "workday-1",
              barberId: "123",
              weekday: 1,
              shifts: [
                {
                  id: "shift-1",
                  workdayId: "workday-1",
                  startAtInMinutes: 480,
                  endAtInMinutes: 1020,
                },
                {
                  id: "shift-2",
                  workdayId: "workday-1",
                  startAtInMinutes: 1080,
                  endAtInMinutes: 1320,
                },
              ],
            },
          },
          example: [
            {
              id: "workday-1",
              barberId: "123",
              weekday: 1,
              shifts: [
                {
                  id: "shift-1",
                  workdayId: "workday-1",
                  startAtInMinutes: 480,
                  endAtInMinutes: 1020,
                },
                {
                  id: "shift-2",
                  workdayId: "workday-1",
                  startAtInMinutes: 1080,
                  endAtInMinutes: 1320,
                },
              ],
            },
          ],
        },
      },
    },
    400: {
      description: "Bad request",
      type: "object",
      properties: {
        message: { type: "string", example: "Invalid barber age." },
        errorCode: { type: "string", example: "BAD_REQUEST" },
        statusCode: { type: "number", example: 400 },
      },
    },
  },
};

const getAllBarbersForBffSwaggerSchema = {
  description: "Get all barbers for BFF (Backend for Frontend)",
  tags: ["barbers"],
  response: {
    200: {
      description: "List of barbers formatted for frontend",
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", example: "123" },
          name: { type: "string", example: "John Doe" },
          hiredAt: { type: "string", example: "2025-09-05T08:00:00Z" },
          specialties: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", example: "barber-1" },
                name: { type: "string", example: "Haircut" },
              },
            },
          },
        },
      },
    },
  },
};

const getBarberSlotsByDateSchema = {
  description: "Get available time slots for a barber on a specific date",
  tags: ["barbers"],
  body: {
    type: "object",
    required: ["barberId", "date"],
    properties: {
      barberId: { type: "string", description: "Barber ID" },
      date: { type: "string", format: "date" },
    },
  },
  response: {
    200: {
      description: "Available time slots by barber and date",
      type: "object",
      properties: {
        data: { type: "array", items: { type: "number", example: 420 } },
      },
    },
    400: {
      description: "Bad request",
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Invalid date format.",
        },
        errorCode: { type: "string", example: "BAD_REQUEST" },
        statusCode: { type: "number", example: 400 },
      },
    },
  },
};

export function barberRoutes(app: FastifyInstance) {
  const createBarberWithSpecialties =
    container.resolve<CreateBarberWithSpecialties>(
      "CreateBarberWithSpecialties"
    );
  const getAllBarbers = container.resolve<GetAllBarbers>("GetAllBarbers");
  const getAllBarbersForBff = container.resolve<GetAllBarbersForBff>(
    "GetAllBarbersForBff"
  );
  const findBarberSlotsByDate = container.resolve<FindBarberSlotsByDate>(
    "FindBarberSlotsByDate"
  );
  const barberController = new BarberController(
    createBarberWithSpecialties,
    getAllBarbers,
    getAllBarbersForBff,
    findBarberSlotsByDate
  );

  app.post("/barbers/new", {
    schema: createBarberSwaggerSchema,
    handler: barberController.createBarber.bind(barberController),
  });

  app.get("/barbers/all/bff", {
    schema: getAllBarbersForBffSwaggerSchema,
    handler: barberController.getAllForBff.bind(barberController),
  });

  app.post("/barbers/slots", {
    schema: getBarberSlotsByDateSchema,
    handler: barberController.getBarberSlotsByDate.bind(barberController),
  });
}
