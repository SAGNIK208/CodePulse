import { Model } from "mongoose";
import Problem, { IProblem } from "../models/Problem";

class ProblemRepository {
  private problemModel: Model<IProblem>;

  constructor() {
    this.problemModel = Problem;
  }

  async createProblem(problemData: IProblem): Promise<IProblem> {
    try {
      return await this.problemModel.create(problemData);
    } catch (error) {
      console.error("Error creating problem:", error);
      throw error;
    }
  }

  async getAllProblems({ page, limit, tags }: { page: number; limit: number; tags: string[] }): Promise<{
    problems: IProblem[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const filter: any = {};
      if (tags.length > 0) {
        filter.tags = { $in: tags };
      }
      const [problems,total] = await Promise.all([this.problemModel
            .find(filter)
            .skip((page - 1) * limit)
            .limit(limit),
            this.problemModel.countDocuments(filter)]);
      return {
        problems,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };      
    } catch (error) {
      console.error("Error fetching all problems:", error);
      throw error;
    }
  }

  async getAllTags(): Promise<string[]> {
    try {
      const tags: string[] = await this.problemModel.distinct("tags");
      return tags;
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  }
  

  async getProblemById(id: string): Promise<IProblem | null> {
    try {
      return await this.problemModel.findById(id);
    } catch (error) {
      console.error("Error fetching problem by ID:", error);
      throw error;
    }
  }

  async deleteProblemById(id: string): Promise<IProblem | null> {
    try {
      return await this.problemModel.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error deleting problem by ID:", error);
      throw error;
    }
  }

  async updateProblemById(id: string, problemData: Partial<IProblem>): Promise<IProblem | null> {
    try {
      return await this.problemModel.findByIdAndUpdate(id, problemData, { new: true });
    } catch (error) {
      console.error("Error updating problem by ID:", error);
      throw error;
    }
  }
}

export default ProblemRepository;
