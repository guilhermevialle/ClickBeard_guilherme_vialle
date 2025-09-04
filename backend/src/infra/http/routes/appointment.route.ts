import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { CreateAppointment } from "../../../application/use-cases/create-appointment";
import { AppointmentController } from "../controllers/appointment.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export function appointmentRoutes(app: FastifyInstance) {
  const createAppointment =
    container.resolve<CreateAppointment>("CreateAppointment");
  const appointmentController = new AppointmentController(createAppointment);
  const authMiddleware = container.resolve<AuthMiddleware>("AuthMiddleware");

  app.post(
    "/appointments/new",
    {
      preHandler: authMiddleware.handle.bind(authMiddleware),
    },
    appointmentController.create.bind(appointmentController)
  );
}
