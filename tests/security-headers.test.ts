import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { createApp } from "../src/app.js";

describe("HTTP security headers", () => {
  let app: FastifyInstance | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it("sends baseline Helmet headers on API responses", async () => {
    process.env.NODE_ENV = "test";
    app = await createApp();

    const response = await app.inject({ method: "GET", url: "/api/health" });

    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(response.headers["content-security-policy"]).toBeTruthy();
  });
});
