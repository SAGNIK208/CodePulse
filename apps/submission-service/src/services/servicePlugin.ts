import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import SubmissionService  from "./submissionService";

async function servicePlugin(fastify: FastifyInstance) {
  fastify.decorate("submissionService", new SubmissionService(fastify.submissionRepository));
}

export default fp(servicePlugin);
