import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { container } from "tsyringe";
import z from "zod";
import { BadRequestError } from "../../../application/errors/shared";
import { GetAdminDashboardDataBff } from "../../../application/use-cases/get-admin-dashboard-data-bff";

// isso nao eh o ideal, apenas fiz pq eh admin, rota helper
const getAdminDashboardDataSchemaDto = z.object({
  date: z.coerce.date("Date must be a valid date"),
});

export function adminRoutes(app: FastifyInstance) {
  const getAdminDashboardDataBff = container.resolve<GetAdminDashboardDataBff>(
    "GetAdminDashboardDataBff"
  );

  app.post("/admin", async (req: FastifyRequest, reply: FastifyReply) => {
    const body = req.body;
    const result = getAdminDashboardDataSchemaDto.safeParse(body);

    if (!result.success) throw new BadRequestError(result.error.message);

    const { date } = result.data;

    const data = await getAdminDashboardDataBff.execute({
      date,
    });

    return reply.status(200).send(data);
  });
}
