import { OmitType, PartialType } from '@nestjs/mapped-types';
import { TaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(OmitType(TaskDto, ['id'])) {}
