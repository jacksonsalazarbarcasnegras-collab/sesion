import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  backendUrl: process.env.BACKEND_URL || 'http://localhost:4000'
};
