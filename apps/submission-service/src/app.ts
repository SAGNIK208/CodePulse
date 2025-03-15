import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import cors from "@fastify/cors";
import servicePlugin from "./services/servicePlugin";
import repositoryPlugin from "./respository/repositoryPlugin";
import apiPlugin from "./routes/apiRoutes";

/**
 * Registers Fastify plugins and routes
 * @param fastify - Fastify instance
 */
async function app(fastify: FastifyInstance) {
  await fastify.register(cors);
  await fastify.register(repositoryPlugin);
  await fastify.register(servicePlugin);
  await fastify.register(apiPlugin, { prefix: "/api" });
}

// Export as a Fastify plugin
export default fp(app);
