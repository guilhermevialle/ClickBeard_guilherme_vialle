import { app } from "./app";

function run() {
  app.listen({ port: 8080 }).then(() => {
    console.log("HTTP server running on http://localhost:8080");
  });
}

run();
