import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não configurada. Defina a conexão PostgreSQL antes de iniciar o serviço de persistência.");
}

const adapter = new PrismaPg({ connectionString });

/** One Prisma client and one PostgreSQL pool per Node.js process. */
export const prisma = new PrismaClient({ adapter });
