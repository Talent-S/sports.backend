import { Role } from '@prisma/client';
import {
  UserProfilePayload,
  UserProfileRepoInterface,
} from '../interfaces/profile.interface';
import { ProfileServiceRPCPayload } from '../interfaces';
import {
  APIError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../utils/error';
import {
  deleteFileFromS3,
  File,
  getS3ObjectKey,
  uploadToS3,
} from '../utils/aws';
export class ProfileService {
  private _repo: UserProfileRepoInterface;
  constructor(repo: UserProfileRepoInterface) {
    this._repo = repo;
  }

  async createProfile(role: Role, data: UserProfilePayload) {
    if (!role || !data) throw new ValidationError('Missing Role and Data');
    if (data.mobileNumber) {
      const numberExist = await this._repo.findProfileByMobile(
        data.mobileNumber
      );
      if (numberExist) throw new ConflictError('Mobile number already exists');
    }
    const username =
      data.firstName.toLowerCase() + '_' + data.lastName.toLowerCase();
    const result = await this._repo.createProfile({ ...data, role, username });
    if (!result) throw new APIError('Internal Server Error');
    return result;
  }
  async updateProfile(userId: string, data: UserProfilePayload) {
    if (!userId || !data) throw new ValidationError('Missing userId or data');
    const userExist = await this._repo.findProfileById(userId);
    if (!userExist) throw new NotFoundError('User Profile not found!');
    if (data.role) {
      data.role = userExist.role;
    }
    const user = await this._repo.updateProfile(userId, data);
    return user;
  }

  async updateProfilePhoto(userId: string, file: File) {
    if (!userId || !file) throw new ValidationError('Missing userId or file');
    const user = await this._repo.findProfileById(userId);
    if (!user) throw new NotFoundError('User Profile not found!');
    if (user.photo) {
      const s3Key = getS3ObjectKey(user.photo);
      if (s3Key) {
        await deleteFileFromS3(s3Key);
      }
    }
    const key = `/media/${userId}/${Date.now().toString()}`;
    const url = await uploadToS3(file, key);
    return await this._repo.updateProfile(userId, { photo: url });
  }
  async getProfile(username: string) {
    if (!username) throw new ValidationError('Missing username');
    const user = await this._repo.findProfileByUsername(username);
    if (!user) throw new NotFoundError('User Profile not found!');
    return user;
  }
  async getProfiles(page: number, limit: number, userType: Role) {
    if (!page || !limit || !userType)
      throw new ValidationError('Missing page, limit or userType');
    const users = await this._repo.findProfiles(limit, page, userType);
    if (!users) throw new NotFoundError('No users found!');
    return users;
  }

  async serveRPCRequest(payload: ProfileServiceRPCPayload) {
    const { type, data } = payload;

    switch (type) {
      case 'NEW_USER':
        return await this.createProfile(data.role, data);
      default:
        throw new ValidationError('Invalid RPC type');
    }
  }
}
