import { describe, expect, it } from "vitest";
import {
  InvalidUserRegistrationError,
  UserEmailAlreadyExistsError,
  UserService,
  type CreateUserRecord,
  type UserRecord,
  type UserRepository,
} from "../src/modules/core/user.service.js";

const id = "2f1f6d82-7b63-4db1-a80d-9d5c8f8e9c01";
const password = "correct-horse-battery-1";

class FakeUserRepository implements UserRepository {
  readonly records: CreateUserRecord[] = [];
  constructor(private existingEmail: string | null = null) {}

  async findByEmail(email: string) {
    return this.existingEmail === email ? { id, email } : null;
  }

  async create(input: CreateUserRecord): Promise<UserRecord> {
    if (this.records.some((record) => record.email === input.email)) {
      throw new UserEmailAlreadyExistsError();
    }
    this.records.push({ ...input });
    return {
      id,
      email: input.email,
      displayName: input.displayName,
      status: "PENDING",
      passwordHash: input.passwordHash,
    };
  }
}

describe("UserService", () => {
  it("normalizes email, hashes the password and returns only public fields", async () => {
    const repository = new FakeUserRepository();
    const hashCalls: string[] = [];
    const service = new UserService(repository, {
      async hash(value) {
        hashCalls.push(value);
        return "$argon2id$reviewed-test-hash-value";
      },
    });

    const result = await service.register({
      email: " PERSON@Example.COM ",
      displayName: " Pessoa Teste ",
      password,
    });

    expect(result).toEqual({
      id,
      email: "person@example.com",
      displayName: "Pessoa Teste",
      status: "PENDING",
    });
    expect(Object.keys(result)).not.toContain("passwordHash");
    expect(repository.records).toHaveLength(1);
    expect(repository.records[0]?.passwordHash).not.toBe(password);
    expect(repository.records[0]?.email).toBe("person@example.com");
    expect(hashCalls).toEqual([password]);
  });

  it("rejects invalid input before repository or hasher calls", async () => {
    const repository = new FakeUserRepository();
    let hashCalls = 0;
    const service = new UserService(repository, {
      async hash() {
        hashCalls += 1;
        return "$argon2id$reviewed-test-hash-value";
      },
    });

    await expect(service.register({
      email: "not-an-email",
      displayName: "A",
      password: "weak",
    })).rejects.toBeInstanceOf(InvalidUserRegistrationError);

    expect(repository.records).toHaveLength(0);
    expect(hashCalls).toBe(0);
  });

  it("rejects an existing normalized email before hashing", async () => {
    const repository = new FakeUserRepository("person@example.com");
    let hashCalls = 0;
    const service = new UserService(repository, {
      async hash() {
        hashCalls += 1;
        return "$argon2id$reviewed-test-hash-value";
      },
    });

    await expect(service.register({
      email: " PERSON@Example.COM ",
      displayName: "Pessoa Teste",
      password,
    })).rejects.toBeInstanceOf(UserEmailAlreadyExistsError);

    expect(hashCalls).toBe(0);
    expect(repository.records).toHaveLength(0);
  });

  it("refuses an obviously invalid hasher result", async () => {
    const repository = new FakeUserRepository();
    const service = new UserService(repository, {
      async hash(value) { return value; },
    });

    await expect(service.register({
      email: "person@example.com",
      displayName: "Pessoa Teste",
      password,
    })).rejects.toThrow("provedor de hash");
    expect(repository.records).toHaveLength(0);
  });

  it("maps duplicate-email races to the domain error", async () => {
    const repository = new FakeUserRepository();
    repository.create = async () => { throw new UserEmailAlreadyExistsError(); };
    const service = new UserService(repository, {
      async hash() { return "$argon2id$reviewed-test-hash-value"; },
    });

    await expect(service.register({
      email: "person@example.com",
      displayName: "Pessoa Teste",
      password,
    })).rejects.toBeInstanceOf(UserEmailAlreadyExistsError);
  });
});
