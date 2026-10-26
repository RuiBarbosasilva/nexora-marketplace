import { z } from "zod";
import {
  createOrganizationSchema,
  type CreateOrganizationInput,
  type OrganizationStatus,
  type OrganizationType,
} from "./organization.schema.js";

const userIdSchema = z.string().uuid();

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  status: OrganizationStatus;
  createdAt: Date;
}

export interface CreateOrganizationWithOwner {
  organization: CreateOrganizationInput;
  ownerUserId: string;
}

/**
 * Persistence port for organization creation.
 *
 * Implementations must create the organization and its OWNER membership in a
 * single database transaction, and enforce a unique constraint on slug.
 */
export interface OrganizationRepository {
  findBySlug(slug: string): Promise<Pick<OrganizationRecord, "id" | "slug"> | null>;
  createWithOwner(command: CreateOrganizationWithOwner): Promise<OrganizationRecord>;
}

export class OrganizationSlugAlreadyExistsError extends Error {
  constructor() {
    super("O identificador da organização já está em uso.");
    this.name = "OrganizationSlugAlreadyExistsError";
  }
}

export class InvalidOrganizationActorError extends Error {
  constructor() {
    super("Usuário autenticado inválido.");
    this.name = "InvalidOrganizationActorError";
  }
}

export class OrganizationService {
  constructor(private readonly repository: OrganizationRepository) {}

  async create(
    authenticatedUserId: string,
    rawInput: unknown,
  ): Promise<OrganizationRecord> {
    const actor = userIdSchema.safeParse(authenticatedUserId);
    if (!actor.success) throw new InvalidOrganizationActorError();

    const parsed = createOrganizationSchema.safeParse(rawInput);
    if (!parsed.success) {
      throw new Error("Dados da organização inválidos.");
    }

    const existing = await this.repository.findBySlug(parsed.data.slug);
    if (existing) throw new OrganizationSlugAlreadyExistsError();

    // The authenticated identity is supplied separately from the request body.
    // The repository must enforce slug uniqueness and create the OWNER
    // membership atomically to close the check-then-create race.
    try {
      return await this.repository.createWithOwner({
        organization: parsed.data,
        ownerUserId: actor.data,
      });
    } catch (error) {
      // Database adapters should translate their unique-slug constraint error
      // into this domain error; never expose raw database messages to clients.
      if (error instanceof OrganizationSlugAlreadyExistsError) throw error;
      throw error;
    }
  }
}
