import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { generateRandomString } from '../utlis';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const newId = generateRandomString(20);
    return this.prisma.task.create({
      data: { id: newId, ...createTaskDto },
    });
  }

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  async findOne(id: string) {
    const foundTask = await this.prisma.task.findFirst({ where: { id } });

    if (foundTask === null) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return foundTask;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const foundTask = await this.prisma.task.findFirst({ where: { id } });

    if (foundTask === null) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return this.prisma.task.update({
      where: { id },
      data: { ...foundTask, ...updateTaskDto },
    });
  }

  async remove(id: string) {
    const foundTask = await this.prisma.task.findFirst({ where: { id } });

    if (foundTask === null) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return this.prisma.task.delete({ where: { id } });
  }
}
