import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FileService } from './file.service';
import { UploadFileDto } from './dto/upload-file.dto';

@ApiTags('File')
@Controller('files')
export class FileController {
  constructor(private readonly filesService: FileService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Загрузка файла' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024),
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'project', 'folder'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Файл для загрузки',
        },
        project: {
          type: 'string',
          example: 'suppliers',
          description: 'Название проекта',
        },
        folder: {
          type: 'string',
          example: 'products',
          description: 'Папка внутри проекта',
        },
      },
    },
  })
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
  ) {
    return this.filesService.uploadFile(file, dto.project, dto.folder);
  }

  @Post('replace')
  @ApiOperation({ summary: 'Замена файла' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024),
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'project', 'folder', 'oldKey'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Новый файл',
        },
        project: {
          type: 'string',
          example: 'suppliers',
          description: 'Название проекта',
        },
        folder: {
          type: 'string',
          example: 'products',
          description: 'Папка внутри проекта',
        },
        oldKey: {
          type: 'string',
          example: 'suppliers/products/old-image.png',
          description: 'Старый ключ файла для замены',
        },
      },
    },
  })
  replaceFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
  ) {
    return this.filesService.replaceFile(
      file,
      dto.project,
      dto.folder,
      dto.oldKey,
    );
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Удаление файла' })
  deleteFile(@Body('key') key: string) {
    return this.filesService.deleteFile(key);
  }
}
