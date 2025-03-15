import logger from '@repo/config/loggerConfig';
import { CPP_IMAGE } from '@repo/config/constant';
import {
  CodeExecutorStrategy,
  ExecutionResponse,
} from '../types/CodeExecutorStrategy';

import createContainer from './containerFactory';
import { fetchDecodedStream } from './dockerHelper';
import pullImage from './pullImage';

class CppExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string,
  ): Promise<ExecutionResponse> {
    logger.info(inputTestCase, outputTestCase);
    const rawLogBuffer: Buffer[] = [];
    console.log('Initialising a new cpp docker container');
    await pullImage(CPP_IMAGE);
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./main`;
    console.log(runCommand);
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
        return { output: codeResponse, status: 'SUCCESS' };
      } else {
        return { output: codeResponse, status: 'WA' };
      }
    } catch (error) {
      console.log('Error occurred', error);
      if (error === 'TLE') {
        await cppDockerContainer.kill();
      }
      return { output: error as string, status: 'ERROR' };
    } finally {
      await cppDockerContainer.remove();
    }
  }
}

export default CppExecutor;
