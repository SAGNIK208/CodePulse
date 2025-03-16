import { Job, Worker } from 'bullmq';

import redisConnection from '@repo/redis/redisConnection';
import SubmissionJob from '../jobs/SubmissionJob';

export default function SubmissionWorker(queueName: string) {
  new Worker(
    queueName,
    async (job: Job) => {
      console.log('Submission job worker', job.id);
      if (job.name === 'SubmissionJob') {
        const SubmissionJobInstance = new SubmissionJob(job.data);

        SubmissionJobInstance.handle(job);

        return true;
      }
    },
    {
      connection: redisConnection,
    },
  );
}
