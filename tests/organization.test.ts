import { describe, expect, it } from "vitest";
import { canAccessOrganization } from "../src/modules/core/organization-access.js";
import { createOrganizationSchema } from "../src/modules/core/organization.schema.js";

const userId = "2f1f6d82-7b63-4db1-a80d-9d5c8f8e9c01";
const organizationId = "9d7d2a36-8c5c-47a7-9b12-2e3cbca4d8e2";

describe("organization domain", () => {
  it("accepts a valid organization and normalizes its slug", () => {
    const result = createOrganizationSchema.safeParse({
      name: "  Loja Central  ",
      slug: "Loja-Central",
      type: "SELLER",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Loja Central");
      expect(result.data.slug).toBe("loja-central");
    }
  });

  it("rejects malformed slugs and unknown fields", () => {
    expect(createOrganizationSchema.safeParse({
      name: "Loja Central",
      slug: "../admin",
      type: "SELLER",
    }).success).toBe(false);

    expect(createOrganizationSchema.safeParse({
      name: "Loja Central",
      slug: "loja-central",
      type: "SELLER",
      isAdmin: true,
    }).success).toBe(false);
  });
});

describe("organization access policy", () => {
  const base = {
    authenticatedUserId: userId,
    targetOrganizationId: organizationId,
    membership: {
      userId,
      organizationId,
      role: "ADMIN" as const,
      active: true,
    },
  };

  it("allows an active member of the requested organization", () => {
    expect(canAccessOrganization(base)).toBe(true);
  });

  it("denies cross-organization access and mismatched identity", () => {
    expect(canAccessOrganization({
      ...base,
      targetOrganizationId: "a45fbc0c-6e8f-4c91-b02b-61f6a0b43e11",
    })).toBe(false);
    expect(canAccessOrganization({
      ...base,
      authenticatedUserId: "a45fbc0c-6e8f-4c91-b02b-61f6a0b43e11",
    })).toBe(false);
  });

  it("denies inactive membership and insufficient roles", () => {
    expect(canAccessOrganization({
      ...base,
      membership: { ...base.membership, active: false },
    })).toBe(false);
    expect(canAccessOrganization(base, ["OWNER"])).toBe(false);
  });
});
