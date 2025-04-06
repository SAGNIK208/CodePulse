import { FastifyRequest, FastifyReply } from "fastify";
import { FastifyInstance } from "fastify";
import SubmissionService from "../services/submissionService"; // Adjust path
import { ISubmission } from "@repo/db/models/SubmissionModel"; // Define your ISubmission type

interface FastifyWithServices extends FastifyInstance {
  submissionService: SubmissionService;
}

// Define the request body type (excluding `_id` if it's managed by the DB)
type CreateSubmissionBody = Omit<ISubmission, "_id">;

export async function createSubmission(
  this: FastifyWithServices,
  req: FastifyRequest<{ Body: CreateSubmissionBody }>,
  res: FastifyReply
) {
  console.log(req.body);
  const response = await this.submissionService.addSubmission(req.body);
  return res.status(201).send({
    error: {},
    data: response,
    success: true,
    message: "Created submission successfully",
  });
}
