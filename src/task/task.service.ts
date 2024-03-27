import { Injectable } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { PrismaService } from 'src/prisma.service';
import { addDays, startOfDay } from 'date-fns'
import { TaskResponse } from 'src/types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Задачи')
@Injectable()
export class TaskService {

  constructor(private prisma: PrismaService) { }

  async create(dto: TaskDto, userId: string): Promise<TaskResponse> {
    return await this.prisma.task.create({ data: { ...dto, user: { connect: { id: userId } } } });
  }

  async findAll(userId: string, search: string): Promise<TaskResponse[]> {
    return await this.prisma.task.findMany({
      where: {
        userId, name: {
          contains: search,
          mode: 'insensitive'
        }
      }
    });
  }


  async update(dto: Partial<TaskDto>, taskId: string, userId: string,): Promise<TaskResponse> {  //Partial<TaskDto> - превращает поля dto в необязательные
    return await this.prisma.task.update({ where: { userId, id: taskId }, data: dto });
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const deleteTask = await this.prisma.task.delete({ where: { userId, id } });
    return { message: 'Задача успешно удалена!' }
  }

  async todayTasks(id: string): Promise<number> {
    const todayStart = startOfDay(new Date())
    const todayTasks = await this.prisma.task.count({ where: { userId: id, createdAt: { lte: todayStart.toISOString() } } })
    return todayTasks;
  }

  async weekTasks(id: string): Promise<number> {
    const todayStart = startOfDay(addDays(new Date(), 1))
    const weekStart = startOfDay(addDays(new Date(), 7))
    const weekTasks = await this.prisma.task.count({ where: { userId: id, createdAt: { gte: todayStart.toISOString(), lte: weekStart.toISOString() } } })
    return weekTasks;
  }
}
