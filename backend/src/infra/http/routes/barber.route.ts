import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { CreateBarberWithSpecialties } from "../../../application/use-cases/create-barber-with-specialties";
import { BarberController } from "../controllers/barber.controller";

export function barberRoutes(fastify: FastifyInstance) {
  const createBarberWithSpecialties =
    container.resolve<CreateBarberWithSpecialties>(
      "CreateBarberWithSpecialties"
    );
  const barberController = new BarberController(createBarberWithSpecialties);

  fastify.post(
    "/barbers/new",
    barberController.createBarber.bind(barberController)
  );
}
