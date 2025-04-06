/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITestCase } from "@repo/db/models/Problem";
export type SubmissionPayload = {
  code: string;
  language: string;
  testCases: ITestCase[];
  userId: string;
  submissionId: string;
};
