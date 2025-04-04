import axios, { AxiosInstance } from 'axios';
import config from '../config';
import { APIError, ValidationError } from '../utils/error';
class AuthClient {
  private client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: config.AUTH_SERVICE_URL,
      timeout: 50000,
    });
  }
  async validateUser(token: string) {
    try {
      const response = await this.client.get('/validate', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data || !response.data.id) {
        throw new ValidationError('Unable to validate');
      }
      return response.data;
    } catch (error) {
      console.log('ERROR in validate user');
      throw new APIError(error);
    }
  }
}

export const authClient = new AuthClient();
