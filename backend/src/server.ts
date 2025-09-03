import { app } from "./app";

app.listen({ port: 8080 }).then(() => {
  console.log("HTTP server running on http://localhost:8080");
});
