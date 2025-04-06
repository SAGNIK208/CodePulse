import logger from '@repo/config/loggerConfig';
import { JAVASCRIPT_IMAGE } from '@repo/config/constant';
import {
  CodeExecutorStrategy,
  ExecutionResponse,
  TestCaseResults,
} from '../types/CodeExecutorStrategy';

import createContainer from './containerFactory';
import { fetchDecodedStream } from './dockerHelper';
import pullImage from './pullImage';
import { ITestCase } from '@repo/db/models/Problem';

class JavaScriptExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    testCases:ITestCase[],
  ): Promise<ExecutionResponse> {
    logger.info(testCases);
    let results: TestCaseResults[] = [];
    await pullImage(JAVASCRIPT_IMAGE);
    for(const testCase of testCases){
      const rawLogBuffer: Buffer[] = [];
      let inputTestCase = testCase.input;
      let outputTestCase = testCase.output;
      const runCommand = `echo '${code.replace(/'/g, `'\\''`)}' > main.js && echo '${inputTestCase.replace(/'/g, `'\\''`)}' | node main.js`;
      console.log(runCommand);
      console.log('Initializing a new JavaScript docker container');
      const jsDockerContainer = await createContainer(JAVASCRIPT_IMAGE, [
        '/bin/sh',
        '-c',
        runCommand,
      ]);
  
      // Start the container
      await jsDockerContainer.start();
      console.log('Started the docker container');
      const loggerStream = await jsDockerContainer.logs({
        stdout: true,
        stderr: true,
        timestamps: false,
        follow: true,
      });
  
      loggerStream.on('data', (chunk) => {
        rawLogBuffer.push(chunk);
      });
  
      try {
        const codeResponse: string = await fetchDecodedStream(
          loggerStream,
          rawLogBuffer,
        );
  
        if (codeResponse.trim() === outputTestCase.trim()) {
          results.push({ output: codeResponse, status: 'SUCCESS' });
        } else {
          results.push({ output: codeResponse, status: 'WA' });
        }
      } catch (error) {
        console.log('Error occurred', error);
        if (error === 'TLE') {
          await jsDockerContainer.kill();
        }
        results.push({ output: error as string, status: 'ERROR' });
      } finally {
        await jsDockerContainer.remove();
      }
    }
    return {
      testCaseResults:results,
      status: results.every((r)=>r.status==="SUCCESS") ? "SUCCESS" : "WA"
    }
  }
}

export default JavaScriptExecutor;
