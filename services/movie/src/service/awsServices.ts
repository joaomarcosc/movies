import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { uuidv4 } from 'zod/v4';
import { AppError } from '../errors';

export class AwsServices {
  private instance: S3Client;

  constructor() {
    this.instance = new S3Client({
      region: process.env.AWS_REGION ?? '',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      },
    });
  }

  /**
   *
   * @param filename string
   * @param type string
   * @returns Promise<{ signedUrl: string }>
   */
  public generateSignedUrl = async (
    filename: string,
    type: string,
  ): Promise<{ signedUrl: string }> => {
    try {
      const fileKey = `${filename}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET ?? '',
        Key: fileKey,
        ContentType: type,
      });

      const signedUrl = await getSignedUrl(this.instance, command, {
        expiresIn: 60,
      });

      return { signedUrl };
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new AppError(
        500,
        'Failed to generate signed URL' + (error as Error).message,
      );
    }
  };
}
