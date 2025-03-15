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

  async getAllProblems(): Promise<IProblem[]> {
    try {
      return await this.problemModel.find({});
    } catch (error) {
      console.error("Error fetching all problems:", error);
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
