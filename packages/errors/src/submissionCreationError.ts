import BaseError from "./baseError";
import { StatusCodes } from "http-status-codes";

class SubmissionCreationError extends BaseError {
  constructor(message:string) {
    super("SUBMISSION_ERROR", StatusCodes.BAD_REQUEST,message,{});
  }
}

export default SubmissionCreationError;
