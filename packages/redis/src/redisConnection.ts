import Redis from 'ioredis';

import {REDIS_HOST,REDIS_PORT} from '@repo/config/constant';

const redisConfig = {
  port: REDIS_PORT,
  host: REDIS_HOST,
  maxRetriesPerRequest: null,
};

const redisConnection = new Redis(redisConfig);

export default redisConnection;
