import Fastify, { type FastifyInstance, type FastifyError } from "fastify";
import helmet from "@fastify/helmet";

export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: process.env.NODE_ENV !== "test",
    trustProxy: false,
    bodyLimit: 1_048_576,
    requestTimeout: 10_000,
  });

  // Keep Helmet's default security headers, including its default CSP.
  await app.register(helmet);

  app.get("/api/health", async () => ({
    status: "ok",
    service: "nexora",
    version: "0.1.0",
  }));

  app.setNotFoundHandler(async (_request, reply) => reply.code(404).send({
    error: "NOT_FOUND",
    message: "Rota não encontrada",
  }));

  app.setErrorHandler((error: FastifyError, request, reply) => {
    request.log.error({ err: error }, "Request failed");
    const candidateStatus = error.statusCode;
    const statusCode =
      typeof candidateStatus === "number" &&
      candidateStatus >= 400 &&
      candidateStatus < 600
        ? candidateStatus
        : 500;

    const isInternalError = statusCode >= 500;
    return reply.code(statusCode).send({
      error: isInternalError ? "INTERNAL_ERROR" : "REQUEST_ERROR",
      message: isInternalError
        ? "Erro interno do servidor"
        : "Não foi possível processar a requisição",
    });
  });

  return app;
}
