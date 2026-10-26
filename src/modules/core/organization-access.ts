import type { OrganizationMemberRole } from "./organization.schema.js";

export interface OrganizationAccessContext {
  authenticatedUserId: string;
  targetOrganizationId: string;
  membership: {
    userId: string;
    organizationId: string;
    role: OrganizationMemberRole;
    active: boolean;
  } | null;
}

/**
 * Checks membership for one organization and an optional minimum role.
 * Call only after authentication; this function does not authenticate users
 * or fetch membership from storage.
 */
export function canAccessOrganization(
  context: OrganizationAccessContext,
  allowedRoles?: readonly OrganizationMemberRole[],
): boolean {
  const { membership } = context;
  if (!membership || !membership.active) return false;
  if (membership.userId !== context.authenticatedUserId) return false;
  if (membership.organizationId !== context.targetOrganizationId) return false;
  if (allowedRoles && !allowedRoles.includes(membership.role)) return false;
  return true;
}
