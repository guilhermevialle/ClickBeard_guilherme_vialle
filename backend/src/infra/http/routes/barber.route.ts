import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { CreateBarberWithSpecialties } from "../../../application/use-cases/create-barber-with-specialties";
import { FindBarberSlotsByDate } from "../../../application/use-cases/find-barber-slots-by-date";
import { GetAllBarbers } from "../../../application/use-cases/get-all-barbers";
import { GetAllBarbersForBff } from "../../../application/use-cases/get-all-barbers-for-bff";
import { BarberController } from "../controllers/barber.controller";

export function barberRoutes(fastify: FastifyInstance) {
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

  fastify.post(
    "/barbers/new",
    barberController.createBarber.bind(barberController)
  );
  fastify.get("/barbers", barberController.getAll.bind(barberController));
  fastify.get(
    "/barbers/bff",
    barberController.getAllForBff.bind(barberController)
  );
  fastify.post(
    "/barbers/slots",
    barberController.getBarberSlotsByDate.bind(barberController)
  );
}
