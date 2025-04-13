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
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  USER_SERVICE_URL: process.env.USER_SERVICE_URL,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  MAILER: {
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    HOST: process.env.MAILER_HOST,
    SERVICE: process.env.MAILER_SERVICE,
    PORT: process.env.MAILER_PORT,
    SECURE: process.env.MAILER_SECURE,
  },
};
