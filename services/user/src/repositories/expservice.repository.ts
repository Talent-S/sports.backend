import { Service, ExpertService } from '@prisma/client';
import {
  ExpertServiceInterface,
  expertServicePayload,
} from '../interfaces/expservice.interface';

export class ExpertServiceRepo implements ExpertServiceInterface {
  addService(name: string, description: string): Promise<Service> {
    throw new Error('Method not implemented.');
  }
  deleteService(id: string): Promise<Service> {
    throw new Error('Method not implemented.');
  }
  serviceById(id: string): Promise<Service | null> {
    throw new Error('Method not implemented.');
  }
  updateService(
    id: string,
    data: { name: string; description: string }
  ): Promise<Service> {
    throw new Error('Method not implemented.');
  }
  services(): Promise<Service[]> {
    throw new Error('Method not implemented.');
  }
  createExpertService(data: expertServicePayload): Promise<ExpertService> {
    throw new Error('Method not implemented.');
  }
  updateExpertService(
    id: string,
    data: expertServicePayload
  ): Promise<ExpertService> {
    throw new Error('Method not implemented.');
  }
  expertServices(): Promise<ExpertService[]> {
    throw new Error('Method not implemented.');
  }
  expertServiceById(id: string): Promise<ExpertService | null> {
    throw new Error('Method not implemented.');
  }
  expertServiceByServiceId(serviceId: string): Promise<ExpertService | null> {
    throw new Error('Method not implemented.');
  }
  expertServiceByExpertId(expertId: string): Promise<ExpertService | null> {
    throw new Error('Method not implemented.');
  }
  deleteExpertService(id: string): Promise<ExpertService> {
    throw new Error('Method not implemented.');
  }
}
