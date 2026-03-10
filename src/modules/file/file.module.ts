import { Module } from '@nestjs/common';
import { s3Provider } from './s3.provider';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  controllers: [FileController],
  providers: [FileService, s3Provider],
  exports: [FileService],
})
export class FileModule {}
