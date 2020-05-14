import { container } from 'tsyringe';
import  uploadConfig from '@config/upload';

import ISorageProvider from './models/IStorageProvader';
import DiskStorageProvider from './implementations/DiskStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';

const providers = {
  disk: DiskStorageProvider,
  S3: S3StorageProvider,
};

container.registerSingleton<ISorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
)
