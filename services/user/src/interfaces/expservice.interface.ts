import { ExpertService, Service } from '@prisma/client';

export type expertServicePayload = Pick<
  ExpertService,
  'id' | 'createdAt' | 'updatedAt'
>;
export interface ExpertServiceInterface {
  // Admin Only
  addService(name: string, description: string): Promise<Service>;
  deleteService(id: string): Promise<Service>;
  serviceById(id: string): Promise<Service | null>;
  updateService(
    id: string,
    data: { name: string; description: string }
  ): Promise<Service>;
  // All
  services(): Promise<Service[]>;
  createExpertService(data: expertServicePayload): Promise<ExpertService>;
  updateExpertService(
    id: string,
    data: expertServicePayload
  ): Promise<ExpertService>;
  expertServices(): Promise<ExpertService[]>;
  expertServiceById(id: string): Promise<ExpertService | null>;
  expertServiceByServiceId(serviceId: string): Promise<ExpertService | null>;
  expertServiceByExpertId(expertId: string): Promise<ExpertService | null>;
  deleteExpertService(id: string): Promise<ExpertService>;
}
