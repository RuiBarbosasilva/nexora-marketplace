import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { createApp } from "../src/app.js";

describe("API foundation", () => {
  let app: FastifyInstance | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it("returns service health without starting a network listener", async () => {
    process.env.NODE_ENV = "test";
    app = await createApp();
    const response = await app.inject({ method: "GET", url: "/api/health" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok", service: "nexora", version: "0.1.0" });
  });

  it("returns a consistent 404 response for unknown routes", async () => {
    process.env.NODE_ENV = "test";
    app = await createApp();
    const response = await app.inject({ method: "GET", url: "/does-not-exist" });
    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: "NOT_FOUND",
      message: "Rota não encontrada",
    });
  });

  it("does not expose internal error details in 500 responses", async () => {
    process.env.NODE_ENV = "test";
    app = await createApp();
    app.get("/__test/internal-error", async () => {
      throw new Error("sensitive internal detail");
    });

    const response = await app.inject({ method: "GET", url: "/__test/internal-error" });
    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      error: "INTERNAL_ERROR",
      message: "Erro interno do servidor",
    });
    expect(response.body).not.toContain("sensitive internal detail");
  });

  it("does not expose raw client error messages in 4xx responses", async () => {
    process.env.NODE_ENV = "test";
    app = await createApp();
    app.get("/__test/client-error", async () => {
      const error = new Error("secret validation details") as Error & { statusCode: number };
      error.statusCode = 400;
      throw error;
    });

    const response = await app.inject({ method: "GET", url: "/__test/client-error" });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "REQUEST_ERROR",
      message: "Não foi possível processar a requisição",
    });
    expect(response.body).not.toContain("secret validation details");
  });
});
