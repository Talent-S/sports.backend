import { createHash } from 'crypto';
import {
  AuthRepositoryInterface,
  UserPayload,
} from '../interfaces/auth.interface';
import {
  decodeToken,
  generateHash,
  generateSalt,
  isvalidEmail,
} from '../utils';
import {
  APIError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../utils/error';
import { sendMail } from '../utils/mail.util';
import config from '../config';

export class AuthService {
  private _repo: AuthRepositoryInterface;
  constructor(repository: AuthRepositoryInterface) {
    this._repo = repository;
  }
  async userDetails(userId: string) {
    const user = await this._repo.findUserById(userId);
    if (!user) throw new NotFoundError('User not found');
    const { password, salt, ...rest } = user;
    return rest;
  }
  async register(data: {
    email: string;
    password: string;
    role: string;
    mobileNumber: string;
  }) {
    const { email, password, role, mobileNumber } = data;
    if (!email || !password) throw new ValidationError('Missing fields!');
    if (!isvalidEmail(email)) throw new ValidationError('Invalid Email');
    if (password.length < 8)
      throw new ValidationError('Password should be atleat 8 letters');
    const emailExist = await this._repo.findUserByEmail(email);
    if (emailExist) throw new ConflictError('Email already exists');
    const mobileNumberExist = await this._repo.findUserByMobileNumber(
      mobileNumber
    );
    if (mobileNumberExist) {
      throw new ConflictError('Mobile Number already exists');
    }
    const roleExist = await this._repo.findRoleByName(role);
    if (!roleExist)
      throw new ValidationError('Role is either invalid or not exists');
    const salt = generateSalt();
    const hashedPassword = generateHash(salt, password);
    const user = await this._repo.create({
      email,
      password: hashedPassword,
      salt,
      roleId: roleExist.id,
      verified: false,
      mobileNumber,
    });
    if (!user) throw new APIError('Failed to create user');
    return {
      message: 'An OTP has been sent to your email. Please Verify!',
      userId: user.id,
    };
  }
  async rollbackCreate(userId: string) {
    const user = await this._repo.findUserById(userId);
    if (!user) return;
    await this._repo.deleteUser(userId);
  }
  async login(email: string, password: string) {
    if (!email || !password) throw new ValidationError('Missing Fields');
    if (!isvalidEmail(email)) {
      throw new ValidationError('Invalid Email');
    }
    if (password.length < 8) {
      throw new ValidationError('Password should be atleat 8 letters');
    }
    const userExists = await this._repo.findUserByEmail(email);
    if (!userExists) throw new NotFoundError('User not found');
    if (userExists.verified === false) {
      await this.sendOtp(email);
      throw new ValidationError('An OTP has been sent to mail, please verify!');
    }
    const hashedPassword = generateHash(userExists.salt!, password);
    if (hashedPassword !== userExists.password) {
      throw new ValidationError('Invalid Password');
    }
    return {
      id: userExists.id,
      email: userExists.email,
      role: userExists.role.name,
    };
  }
  async verify(email: string, otp: number) {
    if (!email || !otp) throw new ValidationError('Missing Fields');
    const otpExists = await this._repo.findOtpByEmail(email);
    if (!otpExists) throw new ValidationError('Retry sending otp');
    if (typeof otp !== 'number') {
      throw new ValidationError('OTP should be number');
    }
    if (otpExists.otp !== otp) throw new ValidationError('Invalid OTP');
    const currentTime = new Date();
    if (currentTime > otpExists.expiresIn) {
      throw new ValidationError('OTP has expired!');
    }
    const data = await this._repo.verifyUserTransaction(email, otpExists.id);
    if (!data) throw new ValidationError('Failed to verify OTP');
    return data;
  }
  async sendOtp(email: string) {
    const emailExists = await this._repo.findUserByEmail(email);
    if (!emailExists) throw new ValidationError("Email doesn't exists");
    if (emailExists.verified === true)
      throw new ValidationError('Email already verified');
    const otp = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    await this._repo.upsertOtp({
      email,
      otp: parseInt(otp),
      expiresIn: new Date(Date.now() + 5 * 60 * 1000),
    });
    await sendMail(
      email,
      'Your OTP for Verification',

      ` Dear ${emailExists.role.name},
  
  Your One-Time Password (OTP) for verifying your account is: ${otp}.
        
  Please enter this code to complete the verification process. This code is valid for 5 minutes.
        
  If you did not request this, please ignore this email.
        
  Best regards,
  Moovicart Team `
    );
    return {
      message: 'An OTP has been sent to your mail.',
    };
  }
  async updatePassword(userId: string, oldPass: string, newPass: string) {
    if (oldPass.length < 8 && newPass.length < 8)
      throw new ValidationError('Password must be atleast 8 letters');
    const user = await this._repo.findUserById(userId);
    if (!user) throw new NotFoundError('user not found');
    const oldHashedPassword = generateHash(user.salt!, oldPass);
    if (oldHashedPassword !== user.password)
      throw new ValidationError('Invalid Password');
    const newHashedPassword = generateHash(user.salt!, newPass);
    await this._repo.update(userId, { password: newHashedPassword });
    return {
      message: 'Password updated successfully',
    };
  }
  async validateToken(token: string) {
    const decodedToken = decodeToken(token);
    if (!decodedToken.id) throw new ValidationError('Invalid Token');
    const user = await this._repo.findUserById(decodedToken.id);
    if (!user) throw new NotFoundError('User not found');
    if (!user.verified) {
      throw new ValidationError('Pending Verification');
    }
    const { password, salt, roleId, role, ...rest } = user;

    const permissions = await this._repo.findRolePermissions(roleId);
    return {
      id: user.id,
      email: user.email,
      role: role.name,
      permissions,
    };
  }
  async forgotPassword(email: string) {
    if (!email) throw new ValidationError('provide email');
    const user = await this._repo.findUserByEmail(email);
    if (!user) throw new NotFoundError('User not found');

    const token = generateSalt();
    const hashToken = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour
    await this._repo.createResetToken(user.id, hashToken, expiresAt);
    const resetUrl = `${config.CLIENT_URL}/reset-password/${token}`;
    await sendMail(
      user.email,
      'Reset Your Password',
      `We received a request to reset your password. To proceed, please click the link below:

${resetUrl}

If you did not request a password reset, please ignore this email. Your password will not be changed.

For any further assistance, feel free to reach out to our support team.

Best regards,
Moovicart Team
`
    );
  }
  async validateResetToken(token: string) {
    if (!token) throw new ValidationError('Provide token');
    const hashedToken = createHash('sha256').update(token).digest('hex');
    const resetToken = await this._repo.findByToken(hashedToken);
    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new ValidationError('Invalid or Expired token');
    }
  }
  async resetPassword(token: string, password: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex');
    const resetRecord = await this._repo.findByToken(hashedToken);
    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      throw new ValidationError('Invalid or expired token');
    }
    const user = await this._repo.findUserById(resetRecord.userId);
    if (!user) throw new NotFoundError('User not found');
    const newHashedPassword = generateHash(user.salt!, password);
    await this._repo.update(resetRecord.userId, {
      password: newHashedPassword,
    });
    await this._repo.deleteToken(resetRecord.id);
    return {
      message: 'Password reset completed',
    };
  }
}
