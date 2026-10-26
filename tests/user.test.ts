import { describe, expect, it } from "vitest";
import { publicUserSchema, registerUserSchema } from "../src/modules/core/user.schema.js";

describe("user domain schemas", () => {
  it("normalizes email and trims display name", () => {
    const result = registerUserSchema.safeParse({
      email: "  PERSON@Example.COM ",
      displayName: "  Rui Silva ",
      password: "correct-horse-battery-1",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("person@example.com");
      expect(result.data.displayName).toBe("Rui Silva");
    }
  });

  it("rejects weak/oversized passwords, invalid email and unknown fields", () => {
    const base = {
      email: "person@example.com",
      displayName: "Pessoa Teste",
      password: "short",
    };
    expect(registerUserSchema.safeParse(base).success).toBe(false);
    expect(registerUserSchema.safeParse({
      ...base,
      password: "a".repeat(129),
    }).success).toBe(false);
    expect(registerUserSchema.safeParse({
      ...base,
      email: "not-an-email",
      password: "correct-horse-battery-1",
    }).success).toBe(false);
    expect(registerUserSchema.safeParse({
      ...base,
      password: "correct-horse-battery-1",
      role: "ADMIN",
    }).success).toBe(false);
  });

  it("exposes only the public user fields", () => {
    const result = publicUserSchema.safeParse({
      id: "2f1f6d82-7b63-4db1-a80d-9d5c8f8e9c01",
      email: "person@example.com",
      displayName: "Pessoa Teste",
      status: "ACTIVE",
    });
    expect(result.success).toBe(true);
    expect(publicUserSchema.safeParse({
      id: "2f1f6d82-7b63-4db1-a80d-9d5c8f8e9c01",
      email: "person@example.com",
      displayName: "Pessoa Teste",
      status: "ACTIVE",
      passwordHash: "must-not-be-public",
    }).success).toBe(false);
  });
});
