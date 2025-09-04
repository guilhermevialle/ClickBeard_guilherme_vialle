import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { CreateSpecialty } from "../../../application/use-cases/create-specialty";
import { GetAllSpecialties } from "../../../application/use-cases/get-all-specialties";
import { SpecialtyController } from "../controllers/specialty.controller";

export function specialtyRoutes(fastify: FastifyInstance) {
  const createSpecialty = container.resolve<CreateSpecialty>("CreateSpecialty");
  const getAllSpecialties =
    container.resolve<GetAllSpecialties>("GetAllSpecialties");
  const specialtyController = new SpecialtyController(
    getAllSpecialties,
    createSpecialty
  );

  fastify.get(
    "/specialties",
    specialtyController.getAll.bind(specialtyController)
  );
  fastify.post(
    "/specialties/new",
    specialtyController.create.bind(specialtyController)
  );
}
