import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { S3_CLIENT } from './s3.provider';
import { buildFileKey } from '../../common/utils/file-name.util';
import { FileProject, PROJECT_FOLDERS } from './constants/files.constants';

@Injectable()
export class FileService {
  constructor(
    @Inject(S3_CLIENT) private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  private get bucket(): string {
    return this.configService.getOrThrow<string>('S3_BUCKET');
  }

  private get publicBaseUrl(): string {
    return this.configService.getOrThrow<string>('S3_PUBLIC_BASE_URL');
  }

  private validateProjectAndFolder(
    project: string,
    folder: string,
  ): asserts project is FileProject {
    const allowedFolders = PROJECT_FOLDERS[project as FileProject];

    if (!allowedFolders) {
      throw new BadRequestException(`Недопустимый project: ${project}`);
    }

    if (!allowedFolders.includes(folder)) {
      throw new BadRequestException(
        `Для project="${project}" folder="${folder}" недопустим. Разрешено: ${allowedFolders.join(', ')}`,
      );
    }
  }

  async uploadFile(file: Express.Multer.File, project: string, folder: string) {
    if (!file) {
      throw new BadRequestException('Файл обязателен');
    }

    this.validateProjectAndFolder(project, folder);

    const key = buildFileKey(project, folder, file.originalname);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      }),
    );

    return {
      key,
      url: `${this.publicBaseUrl}/${key}`,
      project,
      folder,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteFile(key: string) {
    console.log('keykey', key);
    if (!key?.trim()) {
      throw new BadRequestException('key обязателен');
    }

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    return {
      success: true,
      key,
    };
  }

  async replaceFile(
    file: Express.Multer.File,
    project: string,
    folder: string,
    oldKey?: string,
  ) {
    const uploaded = await this.uploadFile(file, project, folder);

    if (oldKey?.trim()) {
      try {
        await this.deleteFile(oldKey);
      } catch {
        // старый файл не критичен для ответа
      }
    }

    return uploaded;
  }

  extractKeyFromUrl(url: string): string {
    if (!url?.trim()) {
      return '';
    }

    const base = `${this.publicBaseUrl}/`;

    return url.startsWith(base) ? url.slice(base.length) : url;
  }
}
