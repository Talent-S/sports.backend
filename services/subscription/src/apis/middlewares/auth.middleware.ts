import { NextFunction, Request, Response } from 'express';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../utils/error';
import { authClient } from '../../clients/auth.client';

export const userAuthorizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const headers = req.headers.authorization;
    if (!headers) throw new ValidationError('No authorization token passed');
    const token = headers.split(' ')[1];
    if (!token) throw new UnauthorizedError();
    const user = await authClient.validateUser(token);
    console.log('USER IS ');
    console.log(user);
    if (!user) throw new NotFoundError('User not found');
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const checkPermissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new UnauthorizedError('Access Denied');
    const userPermissions = req.user.permissions;
    console.log(userPermissions);
    if (!userPermissions || userPermissions.length < 1) {
      throw new UnauthorizedError('Access Denied. Missing Permissions!');
    }
    const hasPermissions = requiredPermissions.every((per) =>
      userPermissions.includes(per)
    );
    if (!hasPermissions) {
      throw new UnauthorizedError('Access Denied, Missing Permissions');
    }
    next();
  };
};
