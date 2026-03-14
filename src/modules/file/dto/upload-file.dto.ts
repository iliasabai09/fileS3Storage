import { FILE_PROJECTS } from '../constants/files.constants';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({
    description: 'Название проекта',
    enum: FILE_PROJECTS,
    example: 'marketline',
  })
  @IsString()
  @IsIn(FILE_PROJECTS)
  project!: string;

  @ApiProperty({
    description: 'Папка внутри проекта',
    example: 'products',
  })
  @IsString()
  folder!: string;

  @ApiPropertyOptional({
    description: 'Старый ключ файла (если нужно заменить файл)',
    example: 'suppliers/products/old-image.png',
  })
  @IsOptional()
  @IsString()
  oldKey?: string;
}