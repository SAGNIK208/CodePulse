import { ITestCase } from "@repo/db/models/Problem";

export interface CodeExecutorStrategy {
  execute(
    code: string,
    testCases: ITestCase[]
  ): Promise<ExecutionResponse>;
}

export type ExecutionResponse = { testCaseResults:TestCaseResults[],status:string };
export type TestCaseResults = {output:string,status: string}
