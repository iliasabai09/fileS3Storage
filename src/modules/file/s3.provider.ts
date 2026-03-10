import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

export const S3_CLIENT = 'S3_CLIENT';

export const s3Provider: Provider = {
  provide: S3_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new S3Client({
      region: configService.getOrThrow<string>('S3_REGION'),
      endpoint: configService.getOrThrow<string>('S3_ENDPOINT'),
      credentials: {
        accessKeyId: configService.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: configService.getOrThrow<string>('S3_SECRET_KEY'),
      },
      forcePathStyle: false,
    });
  },
};
