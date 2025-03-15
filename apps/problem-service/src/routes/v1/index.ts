import express, { Router } from "express";
import { problemRouter } from "./problemRoutes";

const v1Router: Router = express.Router();

v1Router.use("/problems", problemRouter);

export { v1Router };
