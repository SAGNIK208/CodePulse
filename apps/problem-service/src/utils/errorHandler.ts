import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import BaseError from "@repo/errors/baseError";
import logger from "@repo/config/loggerConfig";

function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction){
  if (err instanceof BaseError) {
   res.status(err.status as number).json({
      status: false,
      message: err.message,
      error: err.description,
      data: {},
    });
  } else {
    logger.error(err);
   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong",
      error: err instanceof Error ? err.message : "Unknown error",
      data: {},
    });
  }
}

export default errorHandler;
