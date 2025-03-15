import Submission, { ISubmission } from "../models/SubmissionModel";

class SubmissionRepository {
  private submissionModel = Submission;

  async createSubmission(submission: Omit<ISubmission, "_id">): Promise<ISubmission & { _id: string }> {
    const response = await this.submissionModel.create(submission);
    return response.toObject() as ISubmission & { _id: string };
  }
}

export default SubmissionRepository;
