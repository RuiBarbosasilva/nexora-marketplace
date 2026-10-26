import { describe, expect, it } from "vitest";
import { SecurityEventStore } from "../src/modules/sentinel/security-events.js";

const requestId = "req-2026-001";
const organizationId = "9d7d2a36-8c5c-47a7-9b12-2e3cbca4d8e2";

describe("NEXORA SENTINEL security event store", () => {
  it("records validated events with stable severity and timestamp", () => {
    const store = new SecurityEventStore();
    const event = store.record({
      type: "WEBHOOK_SIGNATURE_INVALID",
      source: "webhook",
      requestId,
      organizationId,
    }, new Date("2026-10-26T12:00:00.000Z"));

    expect(event.id).toMatch(/^[0-9a-f-]{36}$/i);
    expect(event.severity).toBe("high");
    expect(event.occurredAt).toBe("2026-10-26T12:00:00.000Z");
    expect(store.count()).toBe(1);
    expect(store.count("WEBHOOK_SIGNATURE_INVALID")).toBe(1);
  });

  it("rejects unknown fields so raw payloads and secrets cannot be attached", () => {
    const store = new SecurityEventStore();
    expect(() => store.record({
      type: "AUTH_FAILURE",
      source: "authentication",
      password: "do-not-store",
    } as never)).toThrow();
    expect(store.count()).toBe(0);
  });

  it("requires valid identifiers and a known event type", () => {
    const store = new SecurityEventStore();
    expect(() => store.record({
      type: "AUTH_FAILURE",
      source: "authentication",
      actorId: "not-a-uuid",
    } as never)).toThrow();
    expect(() => store.record({
      type: "UNKNOWN",
      source: "system",
    } as never)).toThrow();
  });

  it("retains only the newest events when the bounded buffer is full", () => {
    const store = new SecurityEventStore({ maxEvents: 2 });
    store.record({ type: "AUTH_FAILURE", source: "authentication", requestId: "one" });
    store.record({ type: "ACCESS_DENIED", source: "authorization", requestId: "two" });
    store.record({ type: "API_RATE_LIMITED", source: "http", requestId: "three" });

    expect(store.count()).toBe(2);
    expect(store.listRecent().map((event) => event.requestId)).toEqual(["three", "two"]);
  });

  it("returns copies and validates list limits", () => {
    const store = new SecurityEventStore({ maxEvents: 3 });
    store.record({ type: "INPUT_REJECTED", source: "http" });
    const listed = store.listRecent();
    listed[0]!.type = "UNEXPECTED_ERROR";

    expect(store.listRecent()[0]!.type).toBe("INPUT_REJECTED");
    expect(() => store.listRecent(0)).toThrow(RangeError);
    expect(() => new SecurityEventStore({ maxEvents: 0 })).toThrow(RangeError);
  });

  it("rejects invalid timestamps and can clear retained events", () => {
    const store = new SecurityEventStore();
    expect(() => store.record(
      { type: "UNEXPECTED_ERROR", source: "system" },
      new Date("invalid"),
    )).toThrow(TypeError);

    store.record({ type: "AUTH_FAILURE", source: "authentication" });
    store.clear();
    expect(store.count()).toBe(0);
  });

  it("assigns elevated severity to webhook integrity signals", () => {
    const store = new SecurityEventStore();
    expect(store.record({
      type: "WEBHOOK_REPLAY",
      source: "webhook",
    }).severity).toBe("high");
    expect(store.record({
      type: "AUTH_FAILURE",
      source: "authentication",
    }).severity).toBe("low");
  });
});
