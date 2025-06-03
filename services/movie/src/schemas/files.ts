import { z } from 'zod';

export const generateSignedUrlSchema = z.object({
  files: z.array(
    z.object({
      filename: z.string().min(1, 'Filename is required'),
      type: z.string().min(1, 'File type is required'),
    }),
  ),
});

export type GenerateSignedUrlSchema = z.infer<typeof generateSignedUrlSchema>;
