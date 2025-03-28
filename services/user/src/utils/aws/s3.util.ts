import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import config from '../../config';
import { APIError, ValidationError } from '../error';

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
export const s3Client = new S3Client({
  region: config.AWS.REGION as string,
  credentials: {
    accessKeyId: config.AWS.ACCESS_KEY as string,
    secretAccessKey: config.AWS.SECRET_ACCESS_KEY as string,
  },
});

export const uploadToS3 = async (File: File, key: string) => {
  console.log(File);
  console.log(getFileType(File));
  try {
    const Key = key + '.' + getFileType(File);
    const command = new PutObjectCommand({
      Bucket: config.AWS.BUCKET,
      Key,
      Body: File.buffer,
    });

    await s3Client.send(command);

    return `${config.AWS.S3_URI}/${Key}`;
  } catch (error) {
    console.log(error);
    throw new APIError('Failed to upload file to s3');
  }
};
export const deleteFileFromS3 = async (key: string) => {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: config.AWS.BUCKET,
      Key: key,
    });
    await s3Client.send(deleteCommand);
    console.log('File deleted Successfully..');
  } catch (error) {
    console.log(error);
    throw new APIError('Failed to delete from s3');
  }
};
export function getS3ObjectKey(location: string) {
  if (!location) return;
  if (!location.startsWith('https://') || !location.includes('.s3.')) {
    throw new ValidationError('Invalid Location');
  }
  const key = location.split('.amazonaws.com/')[1];
  return key;
}

export const getFileType = (file: File) => {
  return file.originalname.split('.').pop();
};
