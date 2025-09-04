import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { GetAllBarberSpecialty } from "../../../application/use-cases/get-all-barber-specialty";
import { BarberSpecialtyController } from "../controllers/barber-specialty.controller";

export function barberSpecialtyRoutes(fastify: FastifyInstance) {
  const getAllBarberSpecialty = container.resolve<GetAllBarberSpecialty>(
    "GetAllBarberSpecialty"
  );
  const barberSpecialtyController = new BarberSpecialtyController(
    getAllBarberSpecialty
  );

  fastify.get(
    "/barber/specialty/all",
    barberSpecialtyController.getAll.bind(barberSpecialtyController)
  );
}
