import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { BadRequestError } from "../../../application/errors/shared";
import { CancelAppointment } from "../../../application/use-cases/cancel-appointment";
import { CreateAppointment } from "../../../application/use-cases/create-appointment";
import { GetCustomerAppointmentsBff } from "../../../application/use-cases/get-customer-appointments-bff";
import { IAppointmentController } from "../../interfaces/controllers/appointment-controller.interface";
import { createAppointmentSchemaDto } from "./dtos/appointment.dto";

interface RequestWithUserId extends FastifyRequest {
  userId: string;
}

@injectable()
export class AppointmentController implements IAppointmentController {
  constructor(
    @inject("CreateAppointment")
    private readonly createAppointment: CreateAppointment,
    @inject("GetCustomerAppointmentsBff")
    private readonly getCustomerAppointmentsBff: GetCustomerAppointmentsBff,
    @inject("CancelAppointment")
    private readonly cancelAppointment: CancelAppointment
  ) {}

  async cancel(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string };

    await this.cancelAppointment.execute({ id });

    reply.status(204).send({
      statusCode: 204,
      message: "Appointment canceled!",
    });
  }

  async getAllByCustomerId(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { userId } = request as RequestWithUserId;
    const appointments = await this.getCustomerAppointmentsBff.execute({
      customerId: userId,
    });

    reply.status(200).send(appointments);
  }

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body = request.body;
    const req = request as RequestWithUserId;
    const result = createAppointmentSchemaDto.safeParse(body);

    if (!result.success)
      throw new BadRequestError(JSON.parse(result.error.message)[0].message);

    const { barberId, specialtyId, startAt } = result.data;

    const appointment = await this.createAppointment.execute({
      barberId,
      customerId: req.userId,
      specialtyId,
      startAt,
    });

    return reply.status(201).send(appointment.toJSON());
  }
}
