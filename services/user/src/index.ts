import express, { ErrorRequestHandler } from 'express';
import { HandleErrorWithLogger } from './utils/error';
import { httpLogger, logger } from './utils/logger';
import cors from 'cors';
import config from './config';
import profileRoutes from './api/routes/profile.route';
import mediaRoutes from './api/routes/media.route';
import { listenToObservers } from './messaging';
const app = express();
const PORT = config.PORT || 8002;
const startApp = async () => {
  // App Config
  const allowedOrigins = [
    'http://localhost:3000', // for local dev
    config.CLIENT_URL,
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // Allow credentials (cookies, session data, etc.)
    })
  );

  // Handle OPTIONS preflight requests
  app.options('*', cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // RPC Observer
  listenToObservers();
  // Logger
  app.use(httpLogger);

  // health Check
  app.use('/api/v1/user/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy😉' });
  });
  // Routes
  app.use('/api/v1/user', profileRoutes);
  app.use('/api/v1/user', mediaRoutes);
  // Error Handler
  app.use(HandleErrorWithLogger as unknown as ErrorRequestHandler);
  app.listen(PORT, () => {
    logger.info(`Server listening at PORT - ${PORT}`);
  });
};
startApp();
