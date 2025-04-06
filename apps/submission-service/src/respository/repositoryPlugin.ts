import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import SubmissionRepository from "@repo/db/repository/submissionRepository";

declare module "fastify" {
  interface FastifyInstance {
    submissionRepository: SubmissionRepository;
  }
}

async function repositoryPlugin(fastify: FastifyInstance) {
  fastify.decorate("submissionRepository", new SubmissionRepository());
}

export default fp(repositoryPlugin);
