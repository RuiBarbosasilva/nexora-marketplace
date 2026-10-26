import Fastify, { type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";

export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: process.env.NODE_ENV !== "test",
    trustProxy: false,
    bodyLimit: 1_048_576,
    requestTimeout: 10_000,
  });

  await app.register(helmet, { contentSecurityPolicy: false });

  app.get("/api/health", async () => ({
    status: "ok",
    service: "nexora",
    version: "0.1.0",
  }));

  app.setNotFoundHandler(async (_request, reply) => reply.code(404).send({
    error: "NOT_FOUND",
    message: "Rota não encontrada",
  }));

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, "Request failed");
    const statusCode = error.statusCode && error.statusCode >= 400 && error.statusCode < 600 ? error.statusCode : 500;
    return reply.code(statusCode).send({
      error: statusCode === 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
      message: statusCode === 500 ? "Erro interno do servidor" : error.message,
    });
  });

  return app;
}
