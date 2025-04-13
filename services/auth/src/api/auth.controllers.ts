import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/error';
import { AuthService } from '../services/auth.service';
import { AuthRepository } from '../repositories/auth.repository';
import { generateToken } from '../utils';
import { userProfileClient } from './user.client';
import { RPCRequest } from '../messaging/rabbitmq';
import { RabbitMQQueues, RPCPayloadTypes } from '../interfaces';
const authService = new AuthService(new AuthRepository());
const register = async (req: Request, res: Response, next: NextFunction) => {
  const { role, email, password, mobileNumber, firstName, lastName } = req.body;
  if (
    !role ||
    !email ||
    !password ||
    !mobileNumber ||
    !firstName ||
    !lastName
  ) {
    res.status(400).json({ error: 'Missing Fields' });
    return;
  }

  try {
    const { message, userId } = await authService.register({
      email,
      password,
      role,
    });
    if (!message) {
      res.status(500).json({ error: 'Something went wrong' });
      return;
    }
    try {
      // Traditional method
      // await userProfileClient.createUserProfile(role, {
      //   id: userId,
      //   firstName,
      //   lastName,
      //   mobileNumber,
      //   role,
      // });
      // RPC method
      const response = await RPCRequest(RabbitMQQueues.USER_QUEUE, {
        type: RPCPayloadTypes.NEW_USER,
        data: {
          id: userId,
          firstName,
          lastName,
          mobileNumber,
          role,
        },
      });
      console.log('RPC Response');

      console.log(response);
      // Need to pass to the broker
      await authService.sendOtp(email);
    } catch (error) {
      await authService.rollbackCreate(userId);
      return next(error);
    }
    res.status(201).json({ message });
  } catch (error) {
    return next(error);
  }
};
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ValidationError('Missing Fields!');
  try {
    const data = await authService.login(email, password);
    const token = generateToken(data, '10d');
    res.status(200).json({ user: data, token });
  } catch (error) {
    return next(error);
  }
};

const verify = async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new ValidationError('Missing Fields!');
  try {
    await authService.verify(email, otp);
    res.status(200).json({ message: 'User verified' });
  } catch (error) {
    return next(error);
  }
};
const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) throw new ValidationError('Email is missing!');
  try {
    const data = await authService.sendOtp(email);
    res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};
const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { oldPassword, newPassword } = req.body;
  try {
    console.log('ID');
    console.log(req.user!.id);
    const data = await authService.updatePassword(
      req.user!.id,
      oldPassword,
      newPassword
    );
    res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};
const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('here');
  const authHeaders = req.headers['authorization'];
  try {
    if (!authHeaders) throw new ValidationError('Unauthorized');
    const token = authHeaders.split(' ')[1];
    const user = await authService.validateToken(token);
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};
const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Provide email' });
  }
  try {
    await authService.forgotPassword(email);
    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (error) {
    return next(error);
  }
};
const validateResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    await authService.validateResetToken(token);
    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    await authService.resetPassword(token, password);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    return next(error);
  }
};
export const AuthController = {
  register,
  login,
  verify,
  resendOtp,
  changePassword,
  validateToken,
  forgotPassword,
  validateResetToken,
  resetPassword,
};
