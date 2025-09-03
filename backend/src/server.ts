import { app } from "./app";
import { BarberFactory } from "./domain/factory/barber.factory";

function run() {
  const barber1 = BarberFactory.createWithWorkdaysAndShifts("barber-1");
  const barber2 = BarberFactory.createWithEmptyWorkdays("barber-2");
  const barber3 = BarberFactory.createWithSingleShift("barber-3");
  const barber4 = BarberFactory.createWithGaps("barber-4");
  const barber5 = BarberFactory.createWithRandomShifts("barber-5");
  const barber6 = BarberFactory.createWithSelectedWeekdays("barber-6", [2, 4]);

  app.get("/", async (request, reply) =>
    reply.send([barber1, barber2, barber3, barber4, barber5, barber6])
  );

  app.listen({ port: 8080 }).then(() => {
    console.log("HTTP server running on http://localhost:8080");
  });
}

run();
