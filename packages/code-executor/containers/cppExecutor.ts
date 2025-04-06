import logger from '@repo/config/loggerConfig';
import { CPP_IMAGE } from '@repo/config/constant';
import {
  CodeExecutorStrategy,
  ExecutionResponse,
  TestCaseResults,
} from '../types/CodeExecutorStrategy';

import createContainer from './containerFactory';
import { fetchDecodedStream } from './dockerHelper';
import pullImage from './pullImage';
import { ITestCase } from '@repo/db/models/Problem';

class CppExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    testCases:ITestCase[]
  ): Promise<ExecutionResponse> {
    logger.info(testCases);
    let results : TestCaseResults[] = [];
    await pullImage(CPP_IMAGE);
    for(const testCase of testCases){
      const rawLogBuffer: Buffer[] = [];
      let inputTestCase = testCase.input;
      let outputTestCase = testCase.output;
      const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./main`;
      console.log(runCommand);
      console.log('Initialising a new cpp docker container');
      const cppDockerContainer = await createContainer(CPP_IMAGE, [
        '/bin/sh',
        '-c',
        runCommand,
      ]);
  
      // starting / booting the corresponding docker container
      await cppDockerContainer.start();
  
      console.log('Started the docker container');
  
      const loggerStream = await cppDockerContainer.logs({
        stdout: true,
        stderr: true,
        timestamps: false,
        follow: true, // whether the logs are streamed or returned as a string
      });
  
      // Attach events on the stream objects to start and stop reading
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
          await cppDockerContainer.kill();
        }
        results.push({ output: error as string, status: 'ERROR' });
      } finally {
        await cppDockerContainer.remove();
      }
    }
    return {
      testCaseResults:results,
      status:results.every((r)=>r.status==="SUCCESS")?"SUCCESS":"WA"
    }
  }
}

export default CppExecutor;
