import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { CreateSpecialty } from "../../../application/use-cases/create-specialty";
import { GetAllSpecialties } from "../../../application/use-cases/get-all-specialties";
import { SpecialtyController } from "../controllers/specialty.controller";

const getAllSpecialtiesSwaggerSchema = {
  description: "Get all specialties",
  tags: ["specialties"],
  response: {
    200: {
      description: "List of specialties",
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", example: "123" },
          name: { type: "string", example: "Haircut" },
          durationInMinutes: { type: "number", example: 30 },
        },
      },
    },
  },
};

const createSpecialtySwaggerSchema = {
  description: "Create a new specialty",
  tags: ["specialties"],
  body: {
    type: "object",
    required: ["name", "durationInMinutes"],
    properties: {
      name: { type: "string" },
      durationInMinutes: { type: "number", minimum: 30 },
    },
  },
  response: {
    201: {
      description: "Specialty created successfully!",
      type: "object",
      properties: {
        id: { type: "string", example: "123" },
        name: { type: "string", example: "Haircut" },
        durationInMinutes: { type: "number", example: 30 },
      },
    },
    400: {
      description: "Bad request",
      type: "object",
      properties: {
        message: { type: "string", example: "Invalid specialty duration." },
        errorCode: { type: "string", example: "BAD_REQUEST" },
        statusCode: { type: "number", example: 400 },
      },
    },
  },
};

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
    { schema: getAllSpecialtiesSwaggerSchema },
    specialtyController.getAll.bind(specialtyController)
  );
  fastify.post(
    "/specialties/new",
    { schema: createSpecialtySwaggerSchema },
    specialtyController.create.bind(specialtyController)
  );
}
