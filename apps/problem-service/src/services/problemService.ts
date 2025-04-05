import markdownSanitize from "../utils/markeddownSanitizer";
import NotFound from "@repo/errors/notFoundError";
import ProblemRepository from "@repo/db/repository/ProblemRepository";
import { IProblem } from "@repo/db/models/Problem"; // Importing only IProblem

class ProblemService {
  private problemRepository: ProblemRepository;

  constructor(problemRepository: ProblemRepository) {
    this.problemRepository = problemRepository;
  }

  async createProblem(problemData: Partial<IProblem>): Promise<IProblem> {
    if (!problemData.title || !problemData.description || !problemData.difficulty) {
      throw new Error("Title, description, and difficulty are required fields.");
    }

    problemData.description = await markdownSanitize(problemData.description);

    const problem = await this.problemRepository.createProblem(problemData as IProblem);
    return problem;
  }

  async getAllProblems(options: { page: number; limit: number; tags: string[] }):Promise<{
    problems: IProblem[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    return this.problemRepository.getAllProblems(options);
  }
  
  async getAllTags(): Promise<string[]> {
    return this.problemRepository.getAllTags();
  }
  

  async getProblem(problemId: string): Promise<IProblem> {
    const problem = await this.problemRepository.getProblemById(problemId);
    if (!problem) {
      throw new NotFound("Problem", problemId);
    }
    return problem;
  }

  async deleteProblem(problemId: string): Promise<IProblem | null> {
    const problem = await this.problemRepository.deleteProblemById(problemId);
    if (!problem) {
      throw new NotFound("Problem", problemId);
    }
    return problem;
  }

  async updateProblem(
    problemId: string,
    problemData: Partial<IProblem>
  ): Promise<IProblem | null> {
    if (problemData.description) {
      problemData.description = await markdownSanitize(problemData.description);
    }

    const problem = await this.problemRepository.updateProblemById(problemId, problemData as IProblem);
    if (!problem) {
      throw new NotFound("Problem", problemId);
    }
    return problem;
  }
}

export default ProblemService;
