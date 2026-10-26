import { describe, expect, it } from "vitest";
import {
  InvalidOrganizationActorError,
  OrganizationService,
  OrganizationSlugAlreadyExistsError,
  type CreateOrganizationWithOwner,
  type OrganizationRecord,
  type OrganizationRepository,
} from "../src/modules/core/organization.service.js";

const ownerId = "2f1f6d82-7b63-4db1-a80d-9d5c8f8e9c01";

class FakeOrganizationRepository implements OrganizationRepository {
  readonly created: CreateOrganizationWithOwner[] = [];
  private readonly slugs = new Map<string, string>();

  async findBySlug(slug: string) {
    const id = this.slugs.get(slug);
    return id ? { id, slug } : null;
  }

  async createWithOwner(command: CreateOrganizationWithOwner): Promise<OrganizationRecord> {
    if (this.slugs.has(command.organization.slug)) {
      throw new OrganizationSlugAlreadyExistsError();
    }

    const id = "9d7d2a36-8c5c-47a7-9b12-2e3cbca4d8e2";
    this.slugs.set(command.organization.slug, id);
    this.created.push(command);

    return {
      id,
      ...command.organization,
      status: "PENDING",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };
  }
}

describe("OrganizationService", () => {
  it("creates an organization using the authenticated user as owner", async () => {
    const repository = new FakeOrganizationRepository();
    const service = new OrganizationService(repository);

    const created = await service.create(ownerId, {
      name: "Loja Central",
      slug: "loja-central",
      type: "SELLER",
    });

    expect(created.slug).toBe("loja-central");
    expect(repository.created).toHaveLength(1);
    expect(repository.created[0]?.ownerUserId).toBe(ownerId);
    expect(repository.created[0]?.organization).toEqual({
      name: "Loja Central",
      slug: "loja-central",
      type: "SELLER",
    });
  });

  it("rejects invalid authenticated identity before persistence", async () => {
    const repository = new FakeOrganizationRepository();
    const service = new OrganizationService(repository);

    await expect(service.create("not-a-uuid", {
      name: "Loja Central",
      slug: "loja-central",
      type: "SELLER",
    })).rejects.toBeInstanceOf(InvalidOrganizationActorError);

    expect(repository.created).toHaveLength(0);
  });

  it("rejects invalid input before persistence", async () => {
    const repository = new FakeOrganizationRepository();
    const service = new OrganizationService(repository);

    await expect(service.create(ownerId, {
      name: "L",
      slug: "../admin",
      type: "SELLER",
      role: "OWNER",
    })).rejects.toThrow("Dados da organização inválidos.");

    expect(repository.created).toHaveLength(0);
  });

  it("rejects an existing slug before attempting creation", async () => {
    const repository = new FakeOrganizationRepository();
    const service = new OrganizationService(repository);
    const input = {
      name: "Loja Central",
      slug: "loja-central",
      type: "SELLER",
    };

    await service.create(ownerId, input);

    await expect(service.create(ownerId, {
      name: "Outra Loja",
      slug: "loja-central",
      type: "SELLER",
    })).rejects.toBeInstanceOf(OrganizationSlugAlreadyExistsError);

    expect(repository.created).toHaveLength(1);
  });

  it("translates a duplicate slug race reported by persistence", async () => {
    const repository = new FakeOrganizationRepository();
    repository.createWithOwner = async () => {
      throw new OrganizationSlugAlreadyExistsError();
    };
    const service = new OrganizationService(repository);

    await expect(service.create(ownerId, {
      name: "Loja Central",
      slug: "loja-central",
      type: "SELLER",
    })).rejects.toBeInstanceOf(OrganizationSlugAlreadyExistsError);
  });
});
