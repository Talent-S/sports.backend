import { Role } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { RequestValidator, roleToDtoMap } from '../../utils/error/validator';
import { ProfileService } from '../../services/profile.service';
import { UserProfileRepository } from '../../repositories/profile.repository';
const profileService = new ProfileService(new UserProfileRepository());
const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role, profileData } = req.body;
  if (!role || !profileData) {
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
  const { errors, input } = await RequestValidator(DtoClass, profileData);
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
export const profileController = {
  createProfile,
  updateProfile,
  getProfile,
};
