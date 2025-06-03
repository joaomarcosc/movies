import z from 'zod';
import { number } from 'zod/v4';

export const createMovieSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  rating: z.number().int().min(0, 'Rating must be at least 0'),
  releaseDate: z.string().min(1, 'Release date is required'),
  isPublic: z.boolean().default(false),
  language: z.string().min(1, 'Language is required'),
  duration: z.number().int().min(1, 'Duration must be positive'),
  trailer: z.string().min(1, 'Trailer is required'),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
  budget: z.number().int().min(0, 'Budget must be at least 0'),
  revenue: z.number().int().min(0, 'Revenue must be at least 0'),
  profit: z.number().int(),
});

export const listMovieSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.number().int().min(1, 'Limit must be at least 1').default(10),
  sortBy: z.enum(['title', 'releaseDate', 'rating']).default('releaseDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

export type CreateMovieSchema = z.infer<typeof createMovieSchema>;
export type ListMovieSchema = z.infer<typeof listMovieSchema>;
