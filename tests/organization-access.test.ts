import { describe, expect, it } from "vitest";
import { canAccessOrganization, type OrganizationAccessContext } from "../src/modules/core/organization-access.js";
import type { OrganizationMemberRole } from "../src/modules/core/organization.schema.js";

const userId = "2f1f6d82-7b63-4db1-a80d-9d5c8f8e9c01";
const otherUserId = "fbd76c5e-2d9a-4e19-9d1b-0f9d87f77a12";
const organizationId = "9d7d2a36-8c5c-47a7-9b12-2e3cbca4d8e2";
const otherOrganizationId = "4d9c51af-14a0-4a77-93e1-7f0a6d4a92b1";

function context(overrides: Partial<OrganizationAccessContext> = {}): OrganizationAccessContext {
  return {
    authenticatedUserId: userId,
    targetOrganizationId: organizationId,
    membership: {
      userId,
      organizationId,
      role: "OWNER",
      active: true,
    },
    ...overrides,
  };
}

describe("canAccessOrganization", () => {
  it("allows an active member of the requested organization when no role filter is supplied", () => {
    expect(canAccessOrganization(context())).toBe(true);
  });

  it("denies a missing membership", () => {
    expect(canAccessOrganization(context({ membership: null }))).toBe(false);
  });

  it("denies an inactive membership", () => {
    expect(canAccessOrganization(context({
      membership: { userId, organizationId, role: "OWNER", active: false },
    }))).toBe(false);
  });

  it("denies a membership belonging to a different authenticated user", () => {
    expect(canAccessOrganization(context({
      membership: { userId: otherUserId, organizationId, role: "OWNER", active: true },
    }))).toBe(false);
  });

  it("denies membership from a different organization", () => {
    expect(canAccessOrganization(context({
      membership: { userId, organizationId: otherOrganizationId, role: "OWNER", active: true },
    }))).toBe(false);
  });

  it("allows only roles explicitly included in the allowlist", () => {
    const roles: OrganizationMemberRole[] = ["OWNER", "ADMIN", "MANAGER", "MEMBER", "VIEWER"];
    for (const role of roles) {
      const memberContext = context({
        membership: { userId, organizationId, role, active: true },
      });
      expect(canAccessOrganization(memberContext, ["OWNER", "ADMIN"])).toBe(
        role === "OWNER" || role === "ADMIN",
      );
    }
  });

  it("denies every role when the allowlist is empty", () => {
    expect(canAccessOrganization(context(), [])).toBe(false);
  });
});
