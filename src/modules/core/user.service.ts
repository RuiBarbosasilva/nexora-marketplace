import { z } from "zod";
import {
  publicUserSchema,
  registerUserSchema,
  type PublicUser,
  type RegisterUserInput,
  type UserStatus,
} from "./user.schema.js";

const userIdSchema = z.string().uuid();

export interface UserRecord {
  id: string;
  email: string;
  displayName: string;
  status: UserStatus;
  passwordHash: string;
}

export interface CreateUserRecord {
  email: string;
  displayName: string;
  passwordHash: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<Pick<UserRecord, "id" | "email"> | null>;
  create(input: CreateUserRecord): Promise<UserRecord>;
}

export interface PasswordHasher {
  hash(password: string): Promise<string>;
}

export class UserEmailAlreadyExistsError extends Error {
  constructor() {
    super("Não foi possível concluir o cadastro com os dados informados.");
    this.name = "UserEmailAlreadyExistsError";
  }
}

export class InvalidUserRegistrationError extends Error {
  constructor() {
    super("Dados de cadastro inválidos.");
    this.name = "InvalidUserRegistrationError";
  }
}

/**
 * Registration orchestration only. Production wiring must provide a reviewed
 * password hasher and a persistent repository with a unique email constraint.
 * The raw password is never passed to the repository or returned to the caller.
 */
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async register(rawInput: unknown): Promise<PublicUser> {
    const parsed = registerUserSchema.safeParse(rawInput);
    if (!parsed.success) throw new InvalidUserRegistrationError();

    const input: RegisterUserInput = parsed.data;
    const existing = await this.repository.findByEmail(input.email);
    if (existing) throw new UserEmailAlreadyExistsError();

    const passwordHash = await this.passwordHasher.hash(input.password);
    if (passwordHash.length < 20 || passwordHash === input.password) {
      throw new Error("O provedor de hash de senha retornou um resultado inválido.");
    }

    let created: UserRecord;
    try {
      created = await this.repository.create({
        email: input.email,
        displayName: input.displayName,
        passwordHash,
      });
    } catch (error) {
      // A database adapter must translate the unique-email constraint to this
      // domain error to handle concurrent registration attempts safely.
      if (error instanceof UserEmailAlreadyExistsError) throw error;
      throw error;
    }

    // Explicitly map public fields. Never serialize the persistence record.
    return publicUserSchema.parse({
      id: created.id,
      email: created.email,
      displayName: created.displayName,
      status: created.status,
    });
  }
}
