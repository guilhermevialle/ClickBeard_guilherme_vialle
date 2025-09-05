import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { container } from "tsyringe";
import z from "zod";
import { BadRequestError } from "../../../application/errors/shared";
import { GetAdminDashboardDataBff } from "../../../application/use-cases/get-admin-dashboard-data-bff";

// isso nao eh o ideal, apenas fiz pq eh admin, rota helper
const getAdminDashboardDataSchemaDto = z.object({
  date: z.coerce.date("Date must be a valid date"),
});

const getAdminDashboardDataSwaggerSchema = {
  description: "Get admin dashboard data",
  tags: ["admin"],
  body: {
    type: "object",
    required: ["date"],
    properties: {
      date: { type: "string", format: "date" },
    },
  },
  response: {
    200: {
      description: "Admin dashboard data",
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", example: "1" },
          barberName: { type: "string", example: "John Doe" },
          customerName: { type: "string", example: "Jane Doe" },
          specialtyName: { type: "string", example: "Haircut" },
          durationInMinutes: { type: "number", example: 30 },
          status: { type: "string", example: "CONFIRMED" },
          startAt: {
            type: "string",
            format: "date-time",
            example: "2023-09-05T08:00:00Z",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-09-05T08:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-09-05T08:00:00Z",
          },
        },
      },
    },
  },
};

export function adminRoutes(app: FastifyInstance) {
  const getAdminDashboardDataBff = container.resolve<GetAdminDashboardDataBff>(
    "GetAdminDashboardDataBff"
  );

  app.post(
    "/admin",
    { schema: getAdminDashboardDataSwaggerSchema },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const body = req.body;
      const result = getAdminDashboardDataSchemaDto.safeParse(body);

      if (!result.success) throw new BadRequestError(result.error.message);

      const { date } = result.data;

      const data = await getAdminDashboardDataBff.execute({
        date,
      });

      return reply.status(200).send(data);
    }
  );
}
