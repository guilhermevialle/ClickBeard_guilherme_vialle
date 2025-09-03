import { app } from "./app";
import { BarberFactory } from "./domain/factory/barber.factory";

function run() {
  const barber = BarberFactory.createWithWorkdaysAndShifts("barber-1");

  app.get("/", async (request, reply) => reply.send(barber));

  app.listen({ port: 8080 }).then(() => {
    console.log("HTTP server running on http://localhost:8080");
  });
}

run();
