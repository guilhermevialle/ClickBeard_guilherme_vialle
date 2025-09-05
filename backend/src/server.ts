import { app } from "./app";

async function run() {
  try {
    await app.ready();

    await app.listen({ port: 8080 });
    console.log("HTTP server running on http://localhost:8080");
    console.log(
      "Swagger documentation available at: http://localhost:8080/documentation"
    );
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

run();
