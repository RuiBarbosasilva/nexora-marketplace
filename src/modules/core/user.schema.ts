import { z } from "zod";

export const userStatusSchema = z.enum(["ACTIVE", "SUSPENDED", "PENDING"]);

export const registerUserSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  displayName: z.string().trim().min(2).max(80),
  password: z.string().min(12).max(128),
}).strict();

export const publicUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().min(2).max(80),
  status: userStatusSchema,
}).strict();

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;
