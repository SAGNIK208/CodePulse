import logger from "@repo/config/loggerConfig";
import { PYTHON_IMAGE } from "@repo/config/constant";
import {
  CodeExecutorStrategy,
  ExecutionResponse,
  TestCaseResults,
} from "../types/CodeExecutorStrategy";

import createContainer from "./containerFactory";
import { fetchDecodedStream } from "./dockerHelper";
import pullImage from "./pullImage";
import { ITestCase } from "@repo/db/models/Problem";

class PythonExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    testCases: ITestCase[]
  ): Promise<ExecutionResponse> {
    logger.info(testCases);
    let results: TestCaseResults[] = [];
    await pullImage(PYTHON_IMAGE);
    for (const testCase of testCases) {
      const rawLogBuffer: Buffer[] = [];
      let inputTestCase = testCase.input;
      let outputTestCase = testCase.output;
      const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
      logger.info(runCommand);
      logger.info("Initialising a new python docker container");
      // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
      const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
        "/bin/sh",
        "-c",
        runCommand,
      ]);

      await pythonDockerContainer.start();

      logger.info("Started the docker container");

      const loggerStream = await pythonDockerContainer.logs({
        stdout: true,
        stderr: true,
        timestamps: false,
        follow: true,
      });

      loggerStream.on("data", (chunk) => {
        rawLogBuffer.push(chunk);
      });
      try {
        const codeResponse: string = await fetchDecodedStream(
          loggerStream,
          rawLogBuffer
        );
        if (codeResponse.trim() === outputTestCase.trim()) {
          results.push({
            status:"SUCCESS",
            output:codeResponse,
          })
        } else {
          results.push({ output: codeResponse, status: "WA" });
        }
      } catch (error) {
        console.log("Error occurred", error);
        if (error === "TLE") {
          await pythonDockerContainer.kill();
        }
        results.push({ output: error as string, status: "ERROR" });
      } finally {
        await pythonDockerContainer.remove();
      }
    }
    return {
      status: results.every((r) => r.status === "SUCCESS") ? "SUCCESS" : "WA",
      testCaseResults: results,
    };
  }
}

export default PythonExecutor;
