import { IsEnum, IsInt, IsString } from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { OmitType } from '@nestjs/mapped-types';

export class TaskDto {
  @IsInt()
  id: number;

  @IsString()
  title: string;

  @IsString()
  description?: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class CreateTaskDto extends OmitType(TaskDto, ['id']) {}
