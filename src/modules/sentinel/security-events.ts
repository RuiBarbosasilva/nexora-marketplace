import { randomUUID } from "node:crypto";
import { z } from "zod";

export const securityEventTypeSchema = z.enum([
  "AUTH_FAILURE",
  "AUTH_RATE_LIMITED",
  "ACCESS_DENIED",
  "INPUT_REJECTED",
  "WEBHOOK_SIGNATURE_INVALID",
  "WEBHOOK_REPLAY",
  "API_RATE_LIMITED",
  "UNEXPECTED_ERROR",
]);

export const securityEventSourceSchema = z.enum([
  "http",
  "authentication",
  "authorization",
  "webhook",
  "system",
]);

export const securityEventInputSchema = z.object({
  type: securityEventTypeSchema,
  source: securityEventSourceSchema,
  requestId: z.string().trim().min(1).max(128).optional(),
  actorId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
}).strict();

export type SecurityEventType = z.infer<typeof securityEventTypeSchema>;
export type SecurityEventSource = z.infer<typeof securityEventSourceSchema>;
export type SecurityEventInput = z.infer<typeof securityEventInputSchema>;
export type SecurityEventSeverity = "low" | "medium" | "high" | "critical";

export interface SecurityEvent extends SecurityEventInput {
  id: string;
  occurredAt: string;
  severity: SecurityEventSeverity;
}

const SEVERITY_BY_TYPE: Record<SecurityEventType, SecurityEventSeverity> = {
  AUTH_FAILURE: "low",
  AUTH_RATE_LIMITED: "medium",
  ACCESS_DENIED: "medium",
  INPUT_REJECTED: "low",
  WEBHOOK_SIGNATURE_INVALID: "high",
  WEBHOOK_REPLAY: "high",
  API_RATE_LIMITED: "medium",
  UNEXPECTED_ERROR: "high",
};

export interface SecurityEventStoreOptions {
  maxEvents?: number;
}

/**
 * Bounded in-memory event buffer for the initial SENTINEL foundation.
 * It deliberately accepts no raw request bodies, credentials, tokens, or IP addresses.
 * This is not durable audit storage and must not be treated as such in production.
 */
export class SecurityEventStore {
  private readonly events: SecurityEvent[] = [];
  private readonly maxEvents: number;

  constructor(options: SecurityEventStoreOptions = {}) {
    const maxEvents = options.maxEvents ?? 1_000;
    if (!Number.isInteger(maxEvents) || maxEvents < 1 || maxEvents > 10_000) {
      throw new RangeError("maxEvents must be an integer between 1 and 10000");
    }
    this.maxEvents = maxEvents;
  }

  record(input: SecurityEventInput, occurredAt = new Date()): SecurityEvent {
    const validated = securityEventInputSchema.parse(input);
    if (Number.isNaN(occurredAt.getTime())) {
      throw new TypeError("occurredAt must be a valid date");
    }

    const event: SecurityEvent = {
      ...validated,
      id: randomUUID(),
      occurredAt: occurredAt.toISOString(),
      severity: SEVERITY_BY_TYPE[validated.type],
    };

    this.events.push(event);
    if (this.events.length > this.maxEvents) this.events.shift();
    return { ...event };
  }

  listRecent(limit = 50): SecurityEvent[] {
    if (!Number.isInteger(limit) || limit < 1 || limit > this.maxEvents) {
      throw new RangeError(`limit must be an integer between 1 and ${this.maxEvents}`);
    }
    return this.events.slice(-limit).reverse().map((event) => ({ ...event }));
  }

  count(type?: SecurityEventType): number {
    if (!type) return this.events.length;
    return this.events.reduce((total, event) => total + Number(event.type === type), 0);
  }

  clear(): void {
    this.events.length = 0;
  }
}
