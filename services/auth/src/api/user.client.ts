import axios, { AxiosInstance } from 'axios';
import config from '../config';
import { APIError, ValidationError } from '../utils/error';
import { logger } from '../utils/logger';
class UserProfileClient {
  private client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: config.USER_SERVICE_URL,
      timeout: 50000,
    });
  }
  async createUserProfile(role: string, input: any) {
    try {
      if (input.role) {
        delete input.role;
      }
      const response = await this.client.post('/profile', {
        role,
        profileData: input,
      });
      if (!response.data || !response.data.user) {
        throw new ValidationError('Unable to create');
      }
      return response.data;
    } catch (error) {
      logger.error('Error in User Client', error);
      throw new APIError(error);
    }
  }
}

export const userProfileClient = new UserProfileClient();
