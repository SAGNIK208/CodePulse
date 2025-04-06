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

  difficultyOrder = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  async getAllProblems({
    page,
    limit,
    tags,
    difficulty,
    sort,
  }: {
    page: number;
    limit: number;
    tags: string[];
    difficulty?: string;
    sort?: string;
  }): Promise<{
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

      if (difficulty) {
        filter.difficulty = difficulty;
      }

      const [sortKey, sortOrder] = sort?.split(":") || [];
      const isDifficultySort =
        sortKey === "difficulty" &&
        (sortOrder === "easy-to-hard" || sortOrder === "hard-to-easy");

      // Use aggregation if sorting by custom difficulty order
      if (isDifficultySort) {
        const pipeline: any[] = [
          { $match: filter },
          {
            $addFields: {
              difficultyOrder: {
                $switch: {
                  branches: [
                    { case: { $eq: ["$difficulty", "easy"] }, then: 1 },
                    { case: { $eq: ["$difficulty", "medium"] }, then: 2 },
                    { case: { $eq: ["$difficulty", "hard"] }, then: 3 },
                  ],
                  default: 4,
                },
              },
            },
          },
          {
            $sort: {
              difficultyOrder: sortOrder === "easy-to-hard" ? 1 : -1,
            },
          },
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ];

        const [problems, total] = await Promise.all([
          this.problemModel.aggregate(pipeline),
          this.problemModel.countDocuments(filter),
        ]);

        return {
          problems,
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        };
      }

      // Default sorting
      const allowedSortFields = ["title", "createdAt"];
      let sortOption: Record<string, 1 | -1> = {};

      if (sortKey && allowedSortFields.includes(sortKey)) {
        sortOption[sortKey] = sortOrder === "desc" ? -1 : 1;
      }

      const [problems, total] = await Promise.all([
        this.problemModel
          .find(filter)
          .sort(sortOption)
          .skip((page - 1) * limit)
          .limit(limit),
        this.problemModel.countDocuments(filter),
      ]);

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

  async updateProblemById(
    id: string,
    problemData: Partial<IProblem>
  ): Promise<IProblem | null> {
    try {
      return await this.problemModel.findByIdAndUpdate(id, problemData, {
        new: true,
      });
    } catch (error) {
      console.error("Error updating problem by ID:", error);
      throw error;
    }
  }
}

export default ProblemRepository;
