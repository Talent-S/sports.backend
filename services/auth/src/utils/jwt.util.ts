import JWT, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { ValidationError } from './error';

interface JWTTokenPayload {
  id: string;
  email: string;
  role: string;
}
interface JWTDecodedToken extends JWTTokenPayload {
  iat: number;
  exp: number;
}
export const generateToken = (
  payload: JWTTokenPayload,
  expiresIn?: SignOptions['expiresIn']
): string => {
  const options: SignOptions = expiresIn ? { expiresIn } : {};

  return JWT.sign(
    payload,
    config.JWT_SECRET as string, // ⬅️ Ensure it's treated as string
    options
  );
};
export const decodeToken = (token: string) => {
  try {
    return JWT.verify(token, config.JWT_SECRET!) as JWTDecodedToken;
  } catch (error) {
    throw new ValidationError('Token Expired or Invalid');
  }
};
