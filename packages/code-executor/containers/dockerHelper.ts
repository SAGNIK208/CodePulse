import DockerStreamOutput from '../types/dockerStreamOutput';
import { DOCKER_STREAM_HEADER_SIZE } from '@repo/config/constant';

export function decodeDockerStream(buffer: Buffer): DockerStreamOutput {
  let offset = 0;

  const output: DockerStreamOutput = { stdout: '', stderr: '' };

  while (offset < buffer.length) {
    const typeOfStream = buffer[offset];

    const length = buffer.readUint32BE(offset + 4);

    offset += DOCKER_STREAM_HEADER_SIZE;

    if (typeOfStream === 1) {
      output.stdout += buffer.toString('utf-8', offset, offset + length);
    } else if (typeOfStream === 2) {
      output.stderr += buffer.toString('utf-8', offset, offset + length);
    }

    offset += length;
  }

  return output;
}

export function fetchDecodedStream(
  loggerStream: NodeJS.ReadableStream,
  rawLogBuffer: Buffer[],
): Promise<string> {
  return new Promise((res, rej) => {
    const timeout = setTimeout(() => {
      console.log('Timeout called');
      rej('TLE');
    }, 2000);
    loggerStream.on('end', () => {
      clearTimeout(timeout);
      console.log(rawLogBuffer);
      const completeBuffer = Buffer.concat(rawLogBuffer);
      const decodedStream = decodeDockerStream(completeBuffer);
      // console.log(decodedStream);
      // console.log(decodedStream.stdout);
      if (decodedStream.stderr) {
        rej(decodedStream.stderr);
      } else {
        res(decodedStream.stdout);
      }
    });
  });
}
