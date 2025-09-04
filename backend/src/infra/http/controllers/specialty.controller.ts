import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { BadRequestError } from "../../../application/errors/shared";
import { CreateSpecialty } from "../../../application/use-cases/create-specialty";
import { GetAllSpecialties } from "../../../application/use-cases/get-all-specialties";
import { createSpecialtySchema } from "../../../interfaces/specialty.interface";
import { ISpecialtyController } from "../../interfaces/controllers/specialty-controller.interface";

@injectable()
export class SpecialtyController implements ISpecialtyController {
  constructor(
    @inject("GetAllSpecialties")
    private readonly getAllSpecialties: GetAllSpecialties,
    @inject("CreateSpecialty") private readonly createSpecialty: CreateSpecialty
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body = request.body;
    const result = createSpecialtySchema.safeParse(body);

    if (!result.success) throw new BadRequestError(result.error.message);

    const { durationInMinutes, name } = result.data;

    const specialty = await this.createSpecialty.execute({
      name,
      durationInMinutes,
    });

    return reply.status(201).send(specialty);
  }

  async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const specialties = await this.getAllSpecialties.execute();
    return reply.status(200).send(specialties.map((s) => s.toJSON()));
  }
}
