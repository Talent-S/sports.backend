import {
  Service,
  ExpertService,
  PrismaClient,
  ServiceType,
} from '@prisma/client';
import {
  ExpertServiceInterface,
  expertServicePayload,
} from '../interfaces/expservice.interface';

export class ExpertServiceRepo implements ExpertServiceInterface {
  private _prisma: PrismaClient;
  constructor() {
    this._prisma = new PrismaClient();
  }
  async addService(name: ServiceType, description: string): Promise<Service> {
    return await this._prisma.service.create({ data: { name, description } });
  }
  async deleteService(id: string): Promise<Service> {
    return await this._prisma.service.delete({ where: { id } });
  }
  async serviceById(id: string): Promise<Service | null> {
    return await this._prisma.service.findUnique({ where: { id } });
  }
  async updateService(
    id: string,
    data: { name: ServiceType; description: string }
  ): Promise<Service> {
    return await this._prisma.service.update({
      where: { id },
      data,
    });
  }
  async services(): Promise<Service[]> {
    return await this._prisma.service.findMany();
  }
  async createExpertService(
    data: expertServicePayload
  ): Promise<ExpertService> {
    return await this._prisma.expertService.create({
      data,
    });
  }
  async updateExpertService(
    id: string,
    data: Partial<expertServicePayload>
  ): Promise<ExpertService> {
    return await this._prisma.expertService.update({
      where: { id },
      data,
    });
  }
  async expertServices(): Promise<ExpertService[]> {
    return await this._prisma.expertService.findMany();
  }
  async expertServiceById(id: string): Promise<ExpertService | null> {
    return await this._prisma.expertService.findUnique({ where: { id } });
  }
  async expertServiceByServiceId(
    serviceId: string
  ): Promise<ExpertService | null> {
    return await this._prisma.expertService.findFirst({
      where: { serviceId },
      include: {
        service: true,
      },
    });
  }
  async expertServicesByExpertId(
    expertId: string
  ): Promise<ExpertService[] | null> {
    return await this._prisma.expertService.findMany({
      where: { expertId },
      include: {
        service: true,
      },
    });
  }
  async expertServiceByIds(
    expertId: string,
    serviceId: string
  ): Promise<ExpertService | null> {
    return await this._prisma.expertService.findFirst({
      where: { expertId, serviceId },
      include: {
        service: true,
      },
    });
  }
  async deleteExpertService(id: string): Promise<ExpertService> {
    return await this._prisma.expertService.delete({ where: { id } });
  }
}
