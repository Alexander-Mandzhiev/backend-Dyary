import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma.service';
import { hash } from 'argon2';
import { User, UserAndTasksResponce } from 'src/types';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService, private taskService: TaskService) { }

  async create(dto: UserDto): Promise<User> {
    const user = { username: '', email: dto.email, password: await hash(dto.password) }
    return await this.prisma.user.create({ data: { ...user, userSettings: { create: {} } } });
  }

  async findOneById(id: string): Promise<UserAndTasksResponce> {
    return await this.prisma.user.findUnique({ where: { id }, include: { tasks: true } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async getProfile(id: string) {
    const profile = await this.findOneById(id);
    const totalTasks = profile.tasks.length;
    const complitedTasks = await this.prisma.task.count({ where: { userId: id, isCompleted: true } });
    const todayTasks = await this.taskService.todayTasks(id)
    const weekTasks = await this.taskService.weekTasks(id)
    const { password, ...rest } = profile;
    return {
      user: rest,
      statistic: [
        { label: 'Всего задач', value: totalTasks },
        { label: 'Выполненные', value: complitedTasks },
        { label: 'Задачи сегодня', value: todayTasks },
        { label: 'Задания недели', value: weekTasks },
      ]
    }
  }

  async update(id: string, dto: UserDto) {
    let data = dto;
    if (dto.password) { data = { ...dto, password: await hash(dto.password) } }
    return await this.prisma.user.update({ where: { id }, data })
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleteTimeBlock = await this.prisma.user.delete({ where: { id } });
    return { message: 'Пользователь успешно удален!' };
  }

}
