import { Worker, Job } from "bullmq";
import redisConnection from "@repo/redis/redisConnection";
import axiosInstance from "@repo/backend-common/axiosInstance";
import { SOCKET_SERVICE_URL } from "@repo/config/constant";

interface EvaluationJobData {
  userId: string;
  [key: string]: any;
}

function evaluationWorker(queue: string): void {
  new Worker<EvaluationJobData>(
    "EvaluationQueue",
    async (job: Job<EvaluationJobData>) => {
      if (job.name === "EvaluationJob") {
        try {
          const response = await axiosInstance.post(
            `${SOCKET_SERVICE_URL}/sendPayload`,
            {
              userId: job.data.userId,
              payload: job.data,
            }
          );
          // console.log(response.data);
          // console.log(job.data);
        } catch (error) {
          console.error("Error in evaluation worker:", error);
        }
      }
    },
    {
      connection: redisConnection,
    }
  );
}

export default evaluationWorker;
