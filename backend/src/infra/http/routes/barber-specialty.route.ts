import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { GetAllBarberSpecialty } from "../../../application/use-cases/get-all-barber-specialty";
import { BarberSpecialtyController } from "../controllers/barber-specialty.controller";

const getAllBarberSpecialtySwaggerSchema = {
  description: "Get all barber specialty relations",
  tags: ["barber-specialty"],
  response: {
    200: {
      description: "List of barber specialty relations",
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", example: "123" },
          barberId: { type: "string", example: "barber-1" },
          specialtyId: { type: "string", example: "specialty-1" },
        },
      },
    },
  },
};

export function barberSpecialtyRoutes(fastify: FastifyInstance) {
  const getAllBarberSpecialty = container.resolve<GetAllBarberSpecialty>(
    "GetAllBarberSpecialty"
  );
  const barberSpecialtyController = new BarberSpecialtyController(
    getAllBarberSpecialty
  );

  fastify.get(
    "/barber-specialty/all",
    { schema: getAllBarberSpecialtySwaggerSchema },
    barberSpecialtyController.getAll.bind(barberSpecialtyController)
  );
}
