// src/controllers/specialist.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { QuerySpecialistsDto } from '../dtos/query.dto';
import {
  CreateSpecialistDto,
  UpdateSpecialistDto,
  PublishSpecialistDto,
} from '../dtos/specialist.dto';
import { SpecialistService } from '../services/specialist.service';

export class SpecialistController {
  private specialistService: SpecialistService;

  constructor() {
    this.specialistService = new SpecialistService();
  }

  getAllSpecialists = async (
    req: Request<{}, {}, {}, QuerySpecialistsDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.specialistService.getAllSpecialists(req.query);
      
      res.json(
        ApiResponse.success(
          'Specialists retrieved successfully',
          result.specialists,
          result.meta
        )
      );
    } catch (error) {
      next(error);
    }
  };

  getPublicSpecialists = async (
    req: Request<{}, {}, {}, QuerySpecialistsDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.specialistService.getPublicSpecialists(req.query);
      
      res.json(
        ApiResponse.success(
          'Public specialists retrieved successfully',
          result.specialists,
          result.meta
        )
      );
    } catch (error) {
      next(error);
    }
  };

  getSpecialistById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const specialist = await this.specialistService.getSpecialistById(req.params.id);
      
      res.json(
        ApiResponse.success('Specialist retrieved successfully', specialist)
      );
    } catch (error) {
      next(error);
    }
  };

  createSpecialist = async (
    req: Request<{}, {}, CreateSpecialistDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const specialist = await this.specialistService.createSpecialist(req.body);
      
      res.status(201).json(
        ApiResponse.success('Specialist created successfully', specialist)
      );
    } catch (error) {
      next(error);
    }
  };

  updateSpecialist = async (
    req: Request<{ id: string }, {}, UpdateSpecialistDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const specialist = await this.specialistService.updateSpecialist(
        req.params.id,
        req.body
      );
      
      res.json(
        ApiResponse.success('Specialist updated successfully', specialist)
      );
    } catch (error) {
      next(error);
    }
  };

  publishSpecialist = async (
    req: Request<{ id: string }, {}, PublishSpecialistDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const specialist = await this.specialistService.publishSpecialist(
        req.params.id,
        req.body.status
      );
      
      res.json(
        ApiResponse.success('Specialist status updated successfully', specialist)
      );
    } catch (error) {
      next(error);
    }
  };

  deleteSpecialist = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.specialistService.deleteSpecialist(req.params.id);
      
      res.json(ApiResponse.success(result.message));
    } catch (error) {
      next(error);
    }
  };
}