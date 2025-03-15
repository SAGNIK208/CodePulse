import { Queue } from 'bullmq';

import redisConnection from '@repo/redis/redisConnection';

export default new Queue('EvaluationQueue', { connection: redisConnection });
