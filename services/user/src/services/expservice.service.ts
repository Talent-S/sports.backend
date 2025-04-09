import {
  ExpertServiceInterface,
  expertServicePayload,
} from '../interfaces/expservice.interface';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../utils/error';

export class ExpertService {
  private _repo: ExpertServiceInterface;
  constructor(repo: ExpertServiceInterface) {
    this._repo = repo;
  }

  // Admin only
  async addExpService(
    userId: string,
    data: Omit<expertServicePayload, 'expertId'>
  ) {
    if (!userId || !data) throw new ValidationError('Missing userId or data');
    const serviceExist = await this._repo.expertServiceByIds(
      userId,
      data.serviceId
    );
    if (serviceExist) throw new ConflictError('Service already exist');
    const service = await this._repo.createExpertService({
      ...data,
      expertId: userId,
    });
    return service;
  }
  async deleteExpService(userId: string, id: string) {
    if (!id) throw new ValidationError('Missing id');
    const service = await this._repo.expertServiceById(id);
    if (!service) throw new NotFoundError('Service not found');
    if (service.expertId !== userId)
      throw new ForbiddenError('You are not allowed to delete this service');
    return await this._repo.deleteExpertService(id);
  }
  async updateExpService(
    userId: string,
    id: string,
    data: Partial<expertServicePayload>
  ) {
    if (!id || !data) throw new ValidationError('Missing id or data');
    const service = await this._repo.expertServiceById(id);
    if (!service) throw new NotFoundError('Service not found');
    if (service.expertId !== userId)
      throw new ForbiddenError('You are not allowed to update this service');
    return await this._repo.updateExpertService(id, data);
  }

  async expertServices(expertId: string) {
    if (!expertId) throw new ValidationError('Missing userId');
    const services = await this._repo.expertServicesByExpertId(expertId);
    if (!services) throw new NotFoundError('No services found for this expert');
    return services;
  }

  async getPlatformServices() {
    const services = await this._repo.services();
    if (!services) throw new NotFoundError('No services found');
    return services;
  }
}
