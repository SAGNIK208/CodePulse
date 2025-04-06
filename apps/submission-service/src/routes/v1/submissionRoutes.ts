import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createSubmission } from "../../controllers/submissionController"; // Adjust path if needed
import SubmissionService from "../../services/submissionService";
import { ISubmission } from "@repo/db/models/SubmissionModel";

declare module "fastify" {
    interface FastifyInstance {
      submissionService: SubmissionService;
    }
}

type CreateSubmissionBody = Omit<ISubmission, "_id">;

async function submissionRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    async (
      req: FastifyRequest<{ Body: CreateSubmissionBody }>,
      res: FastifyReply
    ) => {
      return createSubmission.call(fastify, req, res);
    }
  );
}
export default submissionRoutes;
