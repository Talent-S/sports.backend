import {
  Otp,
  PrismaClient,
  ResetPassword,
  RolePermission,
  User,
} from '@prisma/client';
import {
  AuthRepositoryInterface,
  PopulatedRole,
  PopulatedUser,
  UserPayload,
} from '../interfaces/auth.interface';

export class AuthRepository implements AuthRepositoryInterface {
  _prisma: PrismaClient;
  constructor() {
    this._prisma = new PrismaClient();
  }
  async findUserById(userId: string): Promise<PopulatedUser | null> {
    return await this._prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }
  async findUserByEmail(email: string): Promise<PopulatedUser | null> {
    return this._prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }
  async findRoleById(roleId: string): Promise<PopulatedRole | null> {
    return await this._prisma.role.findUnique({
      where: {
        id: roleId,
      },
      include: {
        permissions: true,
      },
    });
  }
  async findUserByMobileNumber(mobileNumber: string): Promise<User | null> {
    return await this._prisma.user.findUnique({
      where: { mobileNumber },
    });
  }
  async findRoleByName(name: string): Promise<PopulatedRole | null> {
    return await this._prisma.role.findUnique({
      where: {
        name,
      },
      include: {
        permissions: true,
      },
    });
  }
  async findOtpByEmail(email: string): Promise<Otp | null> {
    return this._prisma.otp.findUnique({
      where: {
        email,
      },
    });
  }
  async findRolePermissions(roleId: string): Promise<string[]> {
    const data = await this._prisma.rolePermission.findMany({
      where: {
        roleId,
      },
      select: {
        permission: true,
      },
    });
    const permissionsString = data.map(
      (per) => per.permission.name
      // {
      // return {
      //   name: per.permission.name,
      //   id: per.permission.id,
      // };
      // }
    );
    return permissionsString;
  }
  async findByToken(token: string): Promise<ResetPassword | null> {
    return await this._prisma.resetPassword.findUnique({ where: { token } });
  }
  async create(data: UserPayload): Promise<User> {
    return await this._prisma.user.create({ data });
  }
  async createResetToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<ResetPassword> {
    return await this._prisma.resetPassword.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }
  async update(
    userId: string,
    data: Partial<UserPayload>
  ): Promise<User | null> {
    return await this._prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }
  async delete(userId: string): Promise<User> {
    return await this._prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
  async upsertOtp(data: Omit<Otp, 'updatedAt' | 'id'>): Promise<Otp> {
    return await this._prisma.otp.upsert({
      where: {
        email: data.email,
      },
      create: data,
      update: data,
    });
  }
  async deleteOtp(otpId: string): Promise<Otp> {
    return await this._prisma.otp.delete({ where: { id: otpId } });
  }
  async deleteToken(id: string): Promise<ResetPassword> {
    return await this._prisma.resetPassword.delete({ where: { id } });
  }
  async verifyUserTransaction(email: string, otpId: string): Promise<Boolean> {
    await this._prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          verified: true,
        },
      });
      await prisma.otp.delete({
        where: {
          id: otpId,
        },
      });
    });
    return true;
  }
  async deleteUser(userId: string): Promise<User> {
    return await this._prisma.user.delete({ where: { id: userId } });
  }
}
