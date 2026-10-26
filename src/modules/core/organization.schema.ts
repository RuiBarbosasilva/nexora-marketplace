import { z } from "zod";

export const organizationTypeSchema = z.enum(["SELLER", "MANUFACTURER", "HYBRID"]);
export const organizationStatusSchema = z.enum(["ACTIVE", "SUSPENDED", "PENDING"]);

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(3).max(60),
  type: organizationTypeSchema,
}).strict();

export const organizationMemberRoleSchema = z.enum([
  "OWNER",
  "ADMIN",
  "MANAGER",
  "MEMBER",
  "VIEWER",
]);

export const organizationMemberSchema = z.object({
  organizationId: z.string().uuid(),
  userId: z.string().uuid(),
  role: organizationMemberRoleSchema,
}).strict();

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type OrganizationType = z.infer<typeof organizationTypeSchema>;
export type OrganizationStatus = z.infer<typeof organizationStatusSchema>;
export type OrganizationMemberRole = z.infer<typeof organizationMemberRoleSchema>;
export type OrganizationMemberInput = z.infer<typeof organizationMemberSchema>;
