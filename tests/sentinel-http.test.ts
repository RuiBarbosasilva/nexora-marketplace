import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { createApp } from "../src/app.js";
import { sentinelSecurityEvents } from "../src/modules/sentinel/security-events.js";

describe("SENTINEL HTTP error integration", () => {
  let app: FastifyInstance | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
    sentinelSecurityEvents.clear();
  });

  it("records an unexpected server error without exposing its details", async () => {
    sentinelSecurityEvents.clear();
    process.env.NODE_ENV = "test";
    app = await createApp();
    app.get("/__test/sentinel-error", async () => {
      throw new Error("private internal detail");
    });

    const response = await app.inject({ method: "GET", url: "/__test/sentinel-error" });
    expect(response.statusCode).toBe(500);
    expect(response.body).not.toContain("private internal detail");
    expect(sentinelSecurityEvents.count("UNEXPECTED_ERROR")).toBe(1);
    expect(sentinelSecurityEvents.listRecent()[0]?.source).toBe("http");
    expect(sentinelSecurityEvents.listRecent()[0]?.requestId).toBeTruthy();
  });

  it("records client request errors using a sanitized event type", async () => {
    sentinelSecurityEvents.clear();
    process.env.NODE_ENV = "test";
    app = await createApp();
    app.get("/__test/sentinel-client-error", async () => {
      const error = new Error("private client detail") as Error & { statusCode: number };
      error.statusCode = 400;
      throw error;
    });

    const response = await app.inject({ method: "GET", url: "/__test/sentinel-client-error" });
    expect(response.statusCode).toBe(400);
    expect(response.body).not.toContain("private client detail");
    expect(sentinelSecurityEvents.count("INPUT_REJECTED")).toBe(1);
  });
});
