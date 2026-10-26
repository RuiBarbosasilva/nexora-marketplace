import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = await createApp();

try {
  await app.listen({ host: env.HOST, port: env.PORT });
  app.log.info({ host: env.HOST, port: env.PORT }, "NEXORA API started");
} catch (error) {
  app.log.error(error, "Failed to start NEXORA API");
  await app.close();
  process.exitCode = 1;
}
