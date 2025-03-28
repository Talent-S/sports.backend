import express, { ErrorRequestHandler } from 'express';
import { HandleErrorWithLogger } from './utils/error';
import { httpLogger, logger } from './utils/logger';
import cors from 'cors';
import config from './config';
import authRoutes from './api/auth.routes';
const app = express();
const PORT = config.PORT || 8000;
const startApp = async () => {
  // App Config
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logger
  app.use(httpLogger);
  // health Check
  app.use('/api/v1/auth/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy😉' });
  });
  app.use('/api/v1/auth', authRoutes);
  // Error Handler
  app.use(HandleErrorWithLogger as unknown as ErrorRequestHandler);
  app.listen(PORT, () => {
    logger.info(`Server listening at PORT - ${PORT}`);
  });
};
startApp();
