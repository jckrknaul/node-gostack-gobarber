import path from 'path';
import fs from 'fs';
import mime from 'mime';
import aws, {S3} from 'aws-sdk';
import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvader';
import AppError from '@shared/errors/AppError';

class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'sa-east-1',
    });
  }

  public async saveFile(file: string): Promise<string>{
    const OriginalPath = path.resolve(uploadConfig.uploadsFolder, file);

    const ContentType = mime.getType(OriginalPath);

    if (!ContentType) {
      throw new AppError('Content type is invalid!');
    }

    const fileContent = await fs.promises.readFile(OriginalPath);

    await this.client.putObject({
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType,
    }).promise();

    await fs.promises.unlink(OriginalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void>{

    await this.client.deleteObject({
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
    }).promise();
  }
}

export default DiskStorageProvider;
