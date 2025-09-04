import { app } from "./app";
import { JwtTokenService } from "./infra/services/jwt-token.service";

function run() {
  // const barber1 = BarberFactory.createWithWorkdaysAndShifts("barber-1");
  // const barber2 = BarberFactory.createWithEmptyWorkdays("barber-2");
  // const barber3 = BarberFactory.createWithSingleShift("barber-3");
  // const barber4 = BarberFactory.createWithGaps("barber-4");
  // const barber5 = BarberFactory.createWithRandomShifts("barber-5");
  // const barber6 = BarberFactory.createWithSelectedWeekdays("barber-6", [2, 4]);

  const jwt = new JwtTokenService("secret");

  const token = jwt.sign(
    { userId: "user-1" },
    {
      expiresIn: "4s",
    }
  );

  const token2 = jwt.sign(
    { userId: "user-1" },
    {
      expiresIn: "1h",
    }
  );

  app.get("/", async (request, reply) => reply.send({}));

  app.listen({ port: 8080 }).then(() => {
    console.log("HTTP server running on http://localhost:8080");
  });
}

run();
