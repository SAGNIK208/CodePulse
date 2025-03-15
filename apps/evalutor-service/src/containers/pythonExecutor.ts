import logger from '@repo/config/loggerConfig';
import { PYTHON_IMAGE } from '@repo/config/constant';
import {
  CodeExecutorStrategy,
  ExecutionResponse,
} from '../types/CodeExecutorStrategy';

import createContainer from './containerFactory';
import { fetchDecodedStream } from './dockerHelper';
import pullImage from './pullImage';

class PythonExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string,
  ): Promise<ExecutionResponse> {
    logger.info(inputTestCase, outputTestCase);
    const rawLogBuffer: Buffer[] = [];

    logger.info('Initialising a new python docker container');
    await pullImage(PYTHON_IMAGE);
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
    logger.info(runCommand);
    // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']);
    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
      '/bin/sh',
      '-c',
      runCommand,
    ]);

    await pythonDockerContainer.start();

    logger.info('Started the docker container');

    const loggerStream = await pythonDockerContainer.logs({
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
        await pythonDockerContainer.kill();
      }

      return { output: error as string, status: 'ERROR' };
    } finally {
      await pythonDockerContainer.remove();
    }
  }
}

export default PythonExecutor;
