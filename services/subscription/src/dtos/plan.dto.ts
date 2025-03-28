import { z } from 'zod';

export const planSchema = z.object({
  name: z.string(),
  price: z.number().nonnegative().default(0),
  description: z.string().nullable(),
  interval: z.enum(['day', 'week', 'month', 'year', 'one_time']),
});
export const planFeatureSchema = z.object({
  planId: z.string().length(36, 'Invalid Plan Id'),
  featureId: z.string().length(36, 'Invalid Feature Id'),
  value: z.string(),
});

export const featureSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
});
