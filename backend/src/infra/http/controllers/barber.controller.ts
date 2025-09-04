import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { BadRequestError } from "../../../application/errors/shared";
import {
  CreateBarberWithSpecialties,
  createBarberWithSpecialtiesSchemaDto,
} from "../../../application/use-cases/create-barber-with-specialties";
import { FindBarberSlotsByDate } from "../../../application/use-cases/find-barber-slots-by-date";
import { GetAllBarbers } from "../../../application/use-cases/get-all-barbers";
import { GetAllBarbersForBff } from "../../../application/use-cases/get-all-barbers-for-bff";
import { IBarberController } from "../../interfaces/controllers/barber-controller.interface";
import { getBarberSlotsByDateSchemaDto } from "./dtos/barber.dto";

@injectable()
export class BarberController implements IBarberController {
  constructor(
    @inject("CreateBarberWithSpecialties")
    private readonly createBarberWithSpecialties: CreateBarberWithSpecialties,
    @inject("GetAllBarbers") private readonly getAllBarbers: GetAllBarbers,
    @inject("GetAllBarbersForBff")
    private readonly getAllBarbersForBff: GetAllBarbersForBff,
    @inject("FindBarberSlotsByDate")
    private readonly findBarberSlotsByDate: FindBarberSlotsByDate
  ) {}

  async getBarberSlotsByDate(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const body = request.body;
    const result = getBarberSlotsByDateSchemaDto.safeParse(body);

    if (!result.success) throw new BadRequestError(result.error.message);

    const { barberId, date } = result.data;

    const slots = await this.findBarberSlotsByDate.execute({
      barberId,
      date,
    });

    return reply.status(200).send(slots);
  }

  async getAllForBff(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const barbers = await this.getAllBarbersForBff.execute();
    return reply.status(200).send(barbers);
  }

  async createBarber(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const body = request.body;
    const result = createBarberWithSpecialtiesSchemaDto.safeParse(body);

    if (!result.success)
      throw new BadRequestError(JSON.parse(result.error.message)[0].message);

    const { age, hiredAt, name, specialtyIds } = result.data;

    const barber = await this.createBarberWithSpecialties.execute({
      age,
      hiredAt,
      name,
      specialtyIds,
    });

    return reply.status(201).send(barber.toJSON());
  }

  async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const barbers = await this.getAllBarbers.execute();
    return reply.status(200).send(barbers.map((b) => b.toJSON()));
  }
}
