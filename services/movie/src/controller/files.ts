import { AwsServices } from '../service/awsServices';
import { GenerateSignedUrlSchema } from '../schemas/files';
import { NextFunction, Request, Response } from 'express';

export class FilesController {
  generateSignedUrl = async (
    request: Request<any, any, GenerateSignedUrlSchema>,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { files } = request.body;

      const awsServices = new AwsServices();

      const signedUrls = await Promise.all(
        files.map(async (file) => {
          const { filename, type } = file;
          const { signedUrl } = await awsServices.generateSignedUrl(
            filename,
            type,
          );
          return { filename, signedUrl };
        }),
      );

      response.status(200).json({
        message: 'Signed URLs generated successfully',
        urls: signedUrls,
      });
    } catch (error) {
      next(next);
    }
  };
}
