import * as dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  cors: process.env.CORS,
  mongoDbConnectionUrl: process.env.MONGO_URI,
  accessKeySecret: process.env.ACCESS_TOKEN_SECRET || 'access',
  refreshKeySecret: process.env.REFRESH_TOKEN_SECRET || 'refresh',
  emailUsername: process.env.EMAIL_USERNAME,
  emailPassword: process.env.EAIL_PASSWORD,
  emailPort: process.env.EMAIL_PORT,
  emailHost: process.env.EMAIL_HOST,
};
