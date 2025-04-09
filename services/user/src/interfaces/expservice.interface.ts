import { ExpertService, Service } from '@prisma/client';

export type expertServicePayload = Omit<
  ExpertService,
  'id' | 'createdAt' | 'updatedAt' | 'additionalDetails'
> & {
  additionalDetails?: object;
};
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
    data: Partial<expertServicePayload>
  ): Promise<ExpertService>;
  expertServices(): Promise<ExpertService[]>;
  expertServiceById(id: string): Promise<ExpertService | null>;
  expertServiceByServiceId(serviceId: string): Promise<ExpertService | null>;
  expertServicesByExpertId(expertId: string): Promise<ExpertService[] | null>;
  expertServiceByIds(
    expertId: string,
    serviceId: string
  ): Promise<ExpertService | null>;
  deleteExpertService(id: string): Promise<ExpertService>;
}
