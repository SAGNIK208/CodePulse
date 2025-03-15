import { Job } from 'bullmq';

import { IJob } from '../types/bullMQJobDefination';
import { SubmissionPayload } from '../../../code-executor/types/submissionPayload';
import createExecutor from '@repo/code-executor/executorFactory';
import { ExecutionResponse } from '../../../code-executor/types/CodeExecutorStrategy';
import evaluationQueueProducer from '../producers/evaluationQueueProducer';
export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayload>;
  constructor(payload: Record<string, SubmissionPayload>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handle = async (job?: Job) => {
    console.log('Handler of the job called');
    console.log(this.payload);
  
    if (job) {
      const keys = Object.keys(this.payload);
      if (keys.length === 0) {
        console.error("No payload data available.");
        return;
      }
  
      const key = keys[0] as keyof typeof this.payload; // Ensure key exists
  
      const submission = this.payload[key];
      if (!submission) {
        console.error("Submission data is undefined.");
        return;
      }
  
      // Destructure safely
      const { language: codeLanguage, code, inputCase: inputTestCase, outputCase: outputTestCase, userId, submissionId } = submission;
  
      const strategy = createExecutor(codeLanguage);
      console.log(strategy);
  
      if (strategy != null) {
        const response: ExecutionResponse = await strategy.execute(
          code,
          inputTestCase,
          outputTestCase,
        );
  
        evaluationQueueProducer({
          response,
          userId,
          submissionId,
        });
  
        if (response.status === 'SUCCESS') {
          console.log('Code executed successfully', response);
        } else {
          console.log('Something went wrong with code execution', response);
        }
      }
    }
  };
  failed = (job?: Job): void => {
    console.log('Job failed');
    if (job) {
      console.log(job.id);
    }
  };
}
