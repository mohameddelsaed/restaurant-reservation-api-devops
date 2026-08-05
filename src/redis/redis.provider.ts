import { Provider } from "@nestjs/common";
import Redis from "ioredis";

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    const redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
    });

    redis.on('connect', () => console.log('Redis Client Connected!'));
    redis.on('error', (err) => console.error('Redis Error:', err));

    return redis;
  },
};