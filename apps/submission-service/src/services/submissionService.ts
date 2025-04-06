import SubmissionProducer from "@repo/mq/producers/submissionQueueProducer";
import { fetchProblemDetails } from "@repo/backend-common/api/problemAdminApi";
import SubmissionCreationError from "@repo/errors/submissionCreationError";
import SubmissionRepository from "@repo/db/repository/submissionRepository";
import { ISubmission } from "@repo/db/models/SubmissionModel";

interface CodeStub {
  language: string;
  startSnippet: string;
  endSnippet: string;
}

interface TestCase {
  input: string;
  output: string;
}

interface ProblemAdminApiResponse {
  data: {
    codeStubs: CodeStub[];
    testCases: TestCase[];
  };
}

class SubmissionService {
  private submissionRepository: SubmissionRepository;

  constructor(submissionRepository: SubmissionRepository) {
    this.submissionRepository = submissionRepository;
  }

  async pingCheck(): Promise<string> {
    return "pong";
  }

  async addSubmission(submissionPayload: Omit<ISubmission, "_id">) {
    const { problemId, userId, language } = submissionPayload;

    const problemAdminApiResponse: ProblemAdminApiResponse | null =
      await fetchProblemDetails(problemId);

    if (!problemAdminApiResponse) {
      throw new SubmissionCreationError(
        "Failed to create a submission in the repository"
      );
    }

    const languageCodeStub = problemAdminApiResponse.data.codeStubs.find(
      (codeStub) => codeStub.language.toLowerCase() === language.toLowerCase()
    );

    if (!languageCodeStub) {
      throw new SubmissionCreationError("Language not supported.");
    }

    const modifiedCode = `${languageCodeStub.startSnippet}\n\n${submissionPayload.code}\n\n${languageCodeStub.endSnippet}`;

    const submission = await this.submissionRepository.createSubmission({
      ...submissionPayload,
      code: modifiedCode,
    });

    if (!submission) {
      throw new SubmissionCreationError(
        "Failed to create a submission in the repository"
      );
    }

    const response = await SubmissionProducer({
      [submission._id.toString()]: {
        code: submission.code,
        language: submission.language,
        testCases: problemAdminApiResponse.data.testCases || "",
        userId,
        submissionId: submission._id.toString(),
      },
    });

    return { queueResponse: response, submission };
  }
}

export default SubmissionService;
