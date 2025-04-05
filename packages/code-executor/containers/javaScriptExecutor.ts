import logger from '@repo/config/loggerConfig';
import { JAVASCRIPT_IMAGE } from '@repo/config/constant';
import {
  CodeExecutorStrategy,
  ExecutionResponse,
} from '../types/CodeExecutorStrategy';

import createContainer from './containerFactory';
import { fetchDecodedStream } from './dockerHelper';
import pullImage from './pullImage';

class JavaScriptExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string,
  ): Promise<ExecutionResponse> {
    logger.info(inputTestCase, outputTestCase);
    const rawLogBuffer: Buffer[] = [];

    console.log('Initializing a new JavaScript docker container');
    await pullImage(JAVASCRIPT_IMAGE);

    const runCommand = `echo '${code.replace(/'/g, `'\\''`)}' > main.js && echo '${inputTestCase.replace(/'/g, `'\\''`)}' | node main.js`;
    console.log(runCommand);

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
        return { output: codeResponse, status: 'SUCCESS' };
      } else {
        return { output: codeResponse, status: 'WA' };
      }
    } catch (error) {
      console.log('Error occurred', error);
      if (error === 'TLE') {
        await jsDockerContainer.kill();
      }
      return { output: error as string, status: 'ERROR' };
    } finally {
      await jsDockerContainer.remove();
    }
  }
}

export default JavaScriptExecutor;
