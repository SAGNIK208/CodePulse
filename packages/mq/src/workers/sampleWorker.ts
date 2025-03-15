import { Job, Worker } from 'bullmq';

import redisConnection from '@repo/redis/redisConnection';
import SampleJob from '../jobs/SampleJob';

export default function SampleWorker(queueName: string) {
  new Worker(
    queueName,
    async (job: Job) => {
      console.log('Sample job worker', job);
      if (job.name === 'SampleJob') {
        const sampleJobInstance = new SampleJob(job.data);

        sampleJobInstance.handle(job);

        return true;
      }
    },
    {
      connection: redisConnection,
    },
  );
}
