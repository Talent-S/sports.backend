import { Role } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { RequestValidator, roleToDtoMap } from '../../utils/error/validator';
import { ProfileService } from '../../services/profile.service';
import { UserProfileRepository } from '../../repositories/profile.repository';
import { ExpertService } from '../../services/expservice.service';
import { ExpertServiceRepo } from '../../repositories/expservice.repository';
const profileService = new ProfileService(new UserProfileRepository());
const expertServiceService = new ExpertService(new ExpertServiceRepo());
const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role } = req.body;
  if (!role) {
    res.status(400).json({ error: 'Missing role or profile data' });
    return;
  }
  if (!Object.values(Role).includes(role)) {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }
  const DtoClass = roleToDtoMap[role as Role];
  if (!DtoClass) {
    res.status(400).json({ error: 'No DTO defined for this role' });
    return;
  }
  const { errors, input } = await RequestValidator(DtoClass, req.body);
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  try {
    const user = await profileService.createProfile(role, input as any);
    res.status(200).send({ user });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  if (!data) {
    res.status(400).json({ error: 'Missing profile data' });
    return;
  }
  console.log(req.user);
  // Validate the data fields against respective role fields
  try {
    const user = await profileService.updateProfile(req.user!.id, data);
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};
const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  if (!username) {
    res.status(400).json({ error: 'Missing username' });
    return;
  }
  try {
    const user = await profileService.getProfile(username);
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

// Services

// Fetching Platform services(recorded assessment,...)
const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await expertServiceService.getPlatformServices();
    res.status(200).json(services);
  } catch (error) {
    return next(error);
  }
};

const addExpService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { serviceId } = req.params;
  const { price, additionalDetails } = req.body;
  if (!price) {
    res.status(400).json({ error: 'Missing price' });
    return;
  }
  if (!serviceId) {
    res.status(400).json({ error: 'Missing serviceId' });
    return;
  }
  try {
    const service = await expertServiceService.addExpService(req.user!.id, {
      serviceId,
      price,
      additionalDetails,
    });
    res.status(200).json(service);
  } catch (error) {
    return next(error);
  }
};
const updateExpService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { serviceId } = req.params;
  const { price, additionalDetails } = req.body;
  if (!serviceId) {
    res.status(400).json({ error: 'Missing service id' });
    return;
  }
  try {
    const service = await expertServiceService.updateExpService(
      req.user!.id,
      serviceId,
      {
        price,
        additionalDetails,
      }
    );
    res.status(200).json(service);
  } catch (error) {
    return next(error);
  }
};
const deleteExpService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { serviceId } = req.params;
  if (!serviceId) {
    res.status(400).json({ error: 'Missing service id' });
    return;
  }
  try {
    const service = await expertServiceService.deleteExpService(
      req.user!.id,
      serviceId
    );
    res.status(200).json(service);
  } catch (error) {
    return next(error);
  }
};
const expertServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { expertId } = req.params;
  if (!expertId) {
    res.status(400).json({ error: 'Missing expert id' });
    return;
  }
  try {
    const services = await expertServiceService.expertServices(expertId);
    res.status(200).json(services);
  } catch (error) {
    return next(error);
  }
};

const getProfiles = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit, userType } = req.query;
  if (!page || !limit || !userType) {
    res.status(400).json({ error: 'Missing page, limit or userType' });
    return;
  }
  if (!Object.values(Role).includes(userType as Role)) {
    res.status(400).json({ error: 'Invalid userType' });
    return;
  }
  if (req.user?.role !== Role.admin) {
    if (userType === 'admin') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
  }

  try {
    const users = await profileService.getProfiles(
      Number(page),
      Number(limit),
      userType as Role
    );
    res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};
const updateProfilePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { file } = req;
  if (!file) {
    res.status(400).json({ error: 'Missing file' });
    return;
  }
  try {
    const user = await profileService.updateProfilePhoto(req.user!.id, file);
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};
export const profileController = {
  getServices,
  createProfile,
  updateProfile,
  addExpService,
  updateExpService,
  deleteExpService,
  expertServices,
  getProfiles,
  getProfile,
  updateProfilePhoto,
};
