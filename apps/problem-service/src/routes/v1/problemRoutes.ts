import express, { Router } from "express";
import * as problemController from "../../controllers/problemController"; // Ensure named exports in TS

const problemRouter:Router = express.Router();

problemRouter.get("/health", problemController.pingProblemController);
problemRouter.get("/", problemController.getProblems);
problemRouter.get("/:id", problemController.getProblem);
problemRouter.post("/", problemController.addProblem);
problemRouter.delete("/:id", problemController.deleteProblem);
problemRouter.put("/:id", problemController.updateProblem);

export { problemRouter };
