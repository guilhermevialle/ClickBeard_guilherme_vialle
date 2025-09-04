import { inject, injectable } from "tsyringe";
import { Appointment } from "../../../domain/entities/appointment";
import { IAppointmentRepository } from "../../interfaces/repositories/appointment-repository.interface";
import type { PrismaClientType } from "./prisma/client";

@injectable()
export class PostgresPrismaAppointmentRepository
  implements IAppointmentRepository
{
  constructor(@inject("PrismaClient") private prisma: PrismaClientType) {}

  async save(appointment: Appointment): Promise<void> {
    await this.prisma.appointment.create({
      data: {
        id: appointment.id,
        customerId: appointment.customerId,
        barberId: appointment.barberId,
        specialtyId: appointment.specialtyId,
        startAt: appointment.startAt,
        durationInMinutes: appointment.durationInMinutes,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      },
    });
  }

  async findByCustomerId(customerId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { customerId },
    });

    return appointments.map((appointment) =>
      Appointment.from({
        id: appointment.id,
        customerId: appointment.customerId,
        barberId: appointment.barberId,
        specialtyId: appointment.specialtyId,
        startAt: appointment.startAt,
        durationInMinutes: appointment.durationInMinutes,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      })
    );
  }

  async findByBarberId(barberId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { barberId },
    });

    return appointments.map((appointment) =>
      Appointment.from({
        id: appointment.id,
        customerId: appointment.customerId,
        barberId: appointment.barberId,
        specialtyId: appointment.specialtyId,
        startAt: appointment.startAt,
        durationInMinutes: appointment.durationInMinutes,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      })
    );
  }

  async findAll(): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany();

    return appointments.map((appointment) =>
      Appointment.from({
        id: appointment.id,
        customerId: appointment.customerId,
        barberId: appointment.barberId,
        specialtyId: appointment.specialtyId,
        startAt: appointment.startAt,
        durationInMinutes: appointment.durationInMinutes,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      })
    );
  }
}
