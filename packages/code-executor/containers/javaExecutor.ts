import { JAVA_IMAGE } from '@repo/config/constant';
import logger from '@repo/config/loggerConfig';
import {
  CodeExecutorStrategy,
  ExecutionResponse,
} from '../types/CodeExecutorStrategy';

import createContainer from './containerFactory';
import { fetchDecodedStream } from './dockerHelper';
import pullImage from './pullImage';

class JavaExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string,
  ): Promise<ExecutionResponse> {
    logger.info(inputTestCase, outputTestCase);
    const rawLogBuffer: Buffer[] = [];

    console.log('Initialising a new cpp docker container');
    await pullImage(JAVA_IMAGE);
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
    console.log(runCommand);
    const javaDockerContainer = await createContainer(JAVA_IMAGE, [
      '/bin/sh',
      '-c',
      runCommand,
    ]);

    // starting / booting the corresponding docker container
    await javaDockerContainer.start();

    console.log('Started the docker container');

    const loggerStream = await javaDockerContainer.logs({
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
        await javaDockerContainer.kill();
      }
      return { output: error as string, status: 'ERROR' };
    } finally {
      await javaDockerContainer.remove();
    }
  }
}

export default JavaExecutor;
