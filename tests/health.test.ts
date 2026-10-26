import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { createApp } from "../src/app.js";

describe("GET /api/health", () => {
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
    expect(response.json().error).toBe("NOT_FOUND");
  });
});
