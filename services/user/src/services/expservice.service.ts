import { ValidationError } from '../utils/error';

class ExpertService {
  // Admin only
  addService(name: string, description: string) {
    if (!name || !description)
      throw new ValidationError('Missing name or description');
    // const serviceExist = //
  }
  // Admin Only
  deleteService(id: string) {}
}
