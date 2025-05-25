import { IsEnum, IsString } from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { OmitType } from '@nestjs/mapped-types';

export class TaskDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description?: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class CreateTaskDto extends OmitType(TaskDto, ['id']) {}
