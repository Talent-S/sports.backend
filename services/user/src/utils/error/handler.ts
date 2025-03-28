import { Request, Response, NextFunction } from 'express';
import {
  APIError,
  NotFoundError,
  ValidationError,
  ForbiddenError,
  UnauthorizedError,
  ConflictError,
  UnprocessableEntityError,
  RequestTimeoutError,
  TooManyRequestsError,
} from './error';
import { logger } from '../logger';

export const HandleErrorWithLogger = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('ERROR HERE');
  console.log(error);
  let reportError = true;
  let status = 500;
  let data = error.message;

  // skipping common/known errors
  [
    NotFoundError,
    ValidationError,
    ForbiddenError,
    APIError,
    UnauthorizedError,
    ConflictError,
    UnprocessableEntityError,
    RequestTimeoutError,
    TooManyRequestsError,
  ].forEach((typeOfError) => {
    if (error instanceof typeOfError) {
      status = error.status;
      data = error.message;
    }
  });
  if (reportError) {
    // error reporting tools implementation eg: Cloudwatch,Sentry etc;
    logger.error('error');
  } else {
    logger.warn('warm'); // ignore common errors caused by user
  }

  return res.status(status).json({ error: data });
};

export const HandleUnCaughtException = async (error: Error) => {
  logger.error(error);
  process.exit(1);
};
