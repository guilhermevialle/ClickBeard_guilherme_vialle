import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { CancelAppointment } from "../../../application/use-cases/cancel-appointment";
import { CreateAppointment } from "../../../application/use-cases/create-appointment";
import { GetCustomerAppointmentsBff } from "../../../application/use-cases/get-customer-appointments-bff";
import { AppointmentController } from "../controllers/appointment.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export function appointmentRoutes(app: FastifyInstance) {
  const createAppointment =
    container.resolve<CreateAppointment>("CreateAppointment");
  const getCustomerAppointmentsBff =
    container.resolve<GetCustomerAppointmentsBff>("GetCustomerAppointmentsBff");
  const cancelAppointment =
    container.resolve<CancelAppointment>("CancelAppointment");

  const appointmentController = new AppointmentController(
    createAppointment,
    getCustomerAppointmentsBff,
    cancelAppointment
  );

  const authMiddleware = container.resolve<AuthMiddleware>("AuthMiddleware");

  app.post(
    "/appointments/new",
    {
      preHandler: authMiddleware.handle.bind(authMiddleware),
    },
    appointmentController.create.bind(appointmentController)
  );
  app.get(
    "/appointments/me",
    {
      preHandler: authMiddleware.handle.bind(authMiddleware),
    },
    appointmentController.getAllByCustomerId.bind(appointmentController)
  );
  app.delete(
    "/appointments/:id",
    {
      preHandler: authMiddleware.handle.bind(authMiddleware),
    },
    appointmentController.cancel.bind(appointmentController)
  );
}
