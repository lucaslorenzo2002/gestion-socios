import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const client = createClient(/* {
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 18435
    }
} */);