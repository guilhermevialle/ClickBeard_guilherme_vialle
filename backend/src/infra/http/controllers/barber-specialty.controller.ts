import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { GetAllBarberSpecialty } from "../../../application/use-cases/get-all-barber-specialty";
import { IBarberSpecialtyController } from "../../interfaces/controllers/barber-specialty-controller.interface";

@injectable()
export class BarberSpecialtyController implements IBarberSpecialtyController {
  constructor(
    @inject("GetAllBarberSpecialty")
    private readonly getAllBarberSpecialty: GetAllBarberSpecialty
  ) {}

  async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const allBarberSpecialty = await this.getAllBarberSpecialty.execute();
    return reply.status(200).send(allBarberSpecialty);
  }
}
