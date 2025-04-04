import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'production') {
  const cfg = `./.env.${process.env.NODE_ENV}`;
  dotenv.config({ path: cfg });
} else {
  dotenv.config();
}

export default {
  PORT: process.env.PORT,
  DB: process.env.DATABASE_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  AWS: {
    REGION: process.env.AWS_REGION_APP,
    ACCESS_KEY: process.env.AWS_ACCESS_KEY_APP,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY_APP,
    BUCKET: process.env.AWS_BUCKET_APP,
    S3_URI: process.env.AWS_S3_URI,
  },
};
