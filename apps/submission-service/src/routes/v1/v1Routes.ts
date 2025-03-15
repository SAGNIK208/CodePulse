import { FastifyInstance } from "fastify";
import submissionRoutes from "./submissionRoutes"; // Ensure the correct path

async function v1Plugin(fastify: FastifyInstance) {
  fastify.register(submissionRoutes, { prefix: "/submissions" });
}

export default v1Plugin;
