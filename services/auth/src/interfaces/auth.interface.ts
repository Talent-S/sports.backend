import { Role, User, Otp, RolePermission, ResetPassword } from '@prisma/client';

export type UserPayload = Pick<
  User,
  'email' | 'password' | 'salt' | 'verified' | 'roleId'
>;

export interface PopulatedUser extends User {
  role: PopulatedRole;
}
export interface PopulatedRole extends Role {
  permissions: RolePermission[];
}
export interface AuthRepositoryInterface {
  // User
  findUserById(userId: string): Promise<PopulatedUser | null>;
  findUserByEmail(email: string): Promise<PopulatedUser | null>;
  create(data: UserPayload): Promise<User>;
  update(userId: string, data: Partial<UserPayload>): Promise<User | null>;
  delete(userId: string): Promise<User>;
  verifyUserTransaction(email: string, otpId: string): Promise<Boolean>;
  // Role
  findRoleById(roleId: string): Promise<PopulatedRole | null>;
  findRoleByName(name: string): Promise<PopulatedRole | null>;
  findRolePermissions(roleId: string): Promise<string[]>;
  // OTP
  findOtpByEmail(email: string): Promise<Otp | null>;
  upsertOtp(data: Omit<Otp, 'updatedAt' | 'id'>): Promise<Otp>;
  deleteOtp(otpId: string): Promise<Otp>;
  // Reset Password
  createResetToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<ResetPassword>;
  findByToken(token: string): Promise<ResetPassword | null>;
  deleteToken(id: string): Promise<ResetPassword>;
  deleteUser(userId: string): Promise<User>;
}
declare global {
  namespace Express {
    interface Request {
      user?: Pick<PopulatedUser, 'id' | 'email' | 'role'>;
    }
  }
}
