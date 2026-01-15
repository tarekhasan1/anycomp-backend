// src/services/specialist.service.ts
import { Repository, ILike, In } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Specialist, SpecialistStatus } from '../entities/Specialist.entity';
import { ServiceOffering } from '../entities/ServiceOffering.entity';
import { ApiError } from '../utils/ApiError';
import {
  CreateSpecialistDto,
  UpdateSpecialistDto,
} from '../dtos/specialist.dto';
import { QuerySpecialistsDto } from '../dtos/query.dto';

export class SpecialistService {
  private specialistRepository: Repository<Specialist>;
  private serviceOfferingRepository: Repository<ServiceOffering>;

  constructor() {
    this.specialistRepository = AppDataSource.getRepository(Specialist);
    this.serviceOfferingRepository = AppDataSource.getRepository(ServiceOffering);
  }

  async getAllSpecialists(query: QuerySpecialistsDto) {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = query;

    const skip = (page - 1) * limit;

    // Build query conditions
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    // Execute query with pagination
    const [specialists, total] = await this.specialistRepository.findAndCount({
      where,
      relations: ['service_offerings', 'logo', 'media'],
      order: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    return {
      specialists,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSpecialistById(id: string) {
    const specialist = await this.specialistRepository.findOne({
      where: { id },
      relations: ['service_offerings', 'service_offerings.platform_fee', 'logo', 'media'],
    });

    if (!specialist) {
      throw new ApiError(404, 'Specialist not found');
    }

    return specialist;
  }

  async createSpecialist(data: CreateSpecialistDto) {
    // Check if email already exists
    const existingSpecialist = await this.specialistRepository.findOne({
      where: { contact_email: data.contact_email },
    });

    if (existingSpecialist) {
      throw new ApiError(400, 'Specialist with this email already exists');
    }

    // Create specialist
    const specialist = this.specialistRepository.create({
      name: data.name,
      description: data.description,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      website_url: data.website_url,
      logo_id: data.logo_id,
      status: SpecialistStatus.DRAFT,
    });

    const savedSpecialist = await this.specialistRepository.save(specialist);

    // Create service offerings if provided
    if (data.service_offerings && data.service_offerings.length > 0) {
      const services = data.service_offerings.map((service) =>
        this.serviceOfferingRepository.create({
          ...service,
          specialist_id: savedSpecialist.id,
        })
      );

      await this.serviceOfferingRepository.save(services);
    }

    // Return with relations
    return this.getSpecialistById(savedSpecialist.id);
  }

  async updateSpecialist(id: string, data: UpdateSpecialistDto) {
    const specialist = await this.getSpecialistById(id);

    // Check email uniqueness if updating email
    if (data.contact_email && data.contact_email !== specialist.contact_email) {
      const existingSpecialist = await this.specialistRepository.findOne({
        where: { contact_email: data.contact_email },
      });

      if (existingSpecialist) {
        throw new ApiError(400, 'Specialist with this email already exists');
      }
    }

    // Update specialist fields
    Object.assign(specialist, {
      name: data.name ?? specialist.name,
      description: data.description ?? specialist.description,
      contact_email: data.contact_email ?? specialist.contact_email,
      contact_phone: data.contact_phone ?? specialist.contact_phone,
      website_url: data.website_url ?? specialist.website_url,
      logo_id: data.logo_id ?? specialist.logo_id,
    });

    // Handle service offerings update
    if (data.service_offerings) {
      // Get existing service IDs
      const existingServiceIds = specialist.service_offerings.map((s) => s.id);
      const updatedServiceIds = data.service_offerings
        .filter((s) => s.id)
        .map((s) => s.id);

      // Delete services not in the update list
      const servicesToDelete = existingServiceIds.filter(
        (id) => !updatedServiceIds.includes(id)
      );
      if (servicesToDelete.length > 0) {
        await this.serviceOfferingRepository.delete(servicesToDelete);
      }

      // Update or create services
      for (const serviceData of data.service_offerings) {
        if (serviceData.id) {
          // Update existing
          await this.serviceOfferingRepository.update(serviceData.id, serviceData);
        } else {
          // Create new
          const newService = this.serviceOfferingRepository.create({
            ...serviceData,
            specialist_id: id,
          });
          await this.serviceOfferingRepository.save(newService);
        }
      }
    }

    await this.specialistRepository.save(specialist);

    return this.getSpecialistById(id);
  }

  async publishSpecialist(id: string, status: SpecialistStatus) {
    const specialist = await this.getSpecialistById(id);

    specialist.status = status;
    
    if (status === SpecialistStatus.PUBLISHED && !specialist.published_at) {
      specialist.published_at = new Date();
    }

    await this.specialistRepository.save(specialist);

    return this.getSpecialistById(id);
  }

  async deleteSpecialist(id: string) {
    const specialist = await this.getSpecialistById(id);
    await this.specialistRepository.remove(specialist);
    return { message: 'Specialist deleted successfully' };
  }

  async getPublicSpecialists(query: QuerySpecialistsDto) {
    // Override status to only show published
    return this.getAllSpecialists({
      ...query,
      status: SpecialistStatus.PUBLISHED,
    });
  }
}