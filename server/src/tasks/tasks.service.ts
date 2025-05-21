import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const totalTasks = await this.prisma.task.count();
    return this.prisma.task.create({
      data: { id: totalTasks + 1, ...createTaskDto },
    });
  }

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  async findOne(id: number) {
    const foundTask = await this.prisma.task.findFirst({ where: { id } });

    if (foundTask === null) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return foundTask;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const foundTask = await this.prisma.task.findFirst({ where: { id } });

    if (foundTask === null) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return this.prisma.task.update({
      where: { id },
      data: { ...foundTask, ...updateTaskDto },
    });
  }

  async remove(id: number) {
    const foundTask = await this.prisma.task.findFirst({ where: { id } });

    if (foundTask === null) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return this.prisma.task.delete({ where: { id } });
  }
}
