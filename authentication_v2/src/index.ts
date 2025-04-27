import { Elysia } from "elysia";
import authRouter from "./routes/auth";
import { opentelemetry } from "@elysiajs/opentelemetry";

const PORT = process.env.PORT ?? 8000;
const app = new Elysia()
  .use(opentelemetry())
  .use(authRouter)
  .get("/", () => "Hello Elysia")
  .listen(PORT)
  .get("/", () => {
    return {
      message: "Marketplace Auth API",
      version: "1.0.0",
    };
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
