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
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};
