import { Role } from '@prisma/client';
import {
  UserProfilePayload,
  UserProfileRepoInterface,
} from '../interfaces/profile.interface';
import {
  APIError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../utils/error';
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
    const result = await this._repo.createProfile({ ...data, role });
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
    const user = await this._repo.updateProfile({ ...data, id: userId });
    return user;
  }
}
