import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import ProblemRepository from "@repo/db/repository/ProblemRepository";
import ProblemService from "../services/problemService";
import logger from "@repo/config/loggerConfig";
import { IProblem } from "@repo/db/models/Problem";

const problemService = new ProblemService(new ProblemRepository());

export const pingProblemController = (req: Request, res: Response): void => {
  res.json({
    success: true,
    msg: "Problem Controller is healthy",
  });
};

export const getProblems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await problemService.getAllProblems();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Successfully fetched all the problems",
      error: {},
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getProblem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const problemId: string = req.params.id || "";
    const response = await problemService.getProblem(problemId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Successfully fetched the problem",
      error: {},
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const addProblem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info(`New Problem Request ${JSON.stringify(req.body)}`);
    const newProblem: IProblem = await problemService.createProblem(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully created a new problem",
      error: {},
      data: newProblem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const problemId: string = req.params.id || "";
    const response = await problemService.deleteProblem(problemId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Successfully deleted the problem",
      error: {},
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const problemId: string = req.params.id || "";
    const updatedProblem: Partial<IProblem> = req.body;
    logger.info(`Updated Problem Request ${JSON.stringify(updatedProblem)}`);
    const problem = await problemService.updateProblem(problemId, updatedProblem);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Successfully updated a problem",
      error: {},
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};
