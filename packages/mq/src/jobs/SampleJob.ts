import { Job } from 'bullmq';

import { IJob } from '../types/bullMQJobDefination';

export default class SampleJob implements IJob {
  name: string;
  payload?: Record<string, unknown> | undefined;

  constructor(payload: Record<string, unknown>) {
    this.name = this.constructor.name;
    this.payload = payload;
  }

  handle = (job?: Job) => {
    console.log('Handler of the job called');
    if (job) {
      console.log(job.name, job.id, job.data);
    }
  };

  failed = (job?: Job) => {
    console.log('Job Failed');
    if (job) {
      console.log(job.id);
    }
  };
}
