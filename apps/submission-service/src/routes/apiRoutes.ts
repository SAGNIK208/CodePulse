import { FastifyInstance } from "fastify";
import v1Routes from "./v1/v1Routes"; // Ensure the correct path

async function apiPlugin(fastify: FastifyInstance) {
  fastify.register(v1Routes, { prefix: "/v1" });
}

export default apiPlugin;
