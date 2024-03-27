import { Injectable, NotFoundException } from '@nestjs/common';
import { UserSessionDto } from './dto/user-session.dto';
import { UserRoundDto } from './dto/user-round.dto';
import { PrismaService } from 'src/prisma.service';
import { UserSettingsService } from 'src/user-settings/user-settings.service';
import { SessionRoundResponse, SessionResponse, UserSessionResponse } from 'src/types';

@Injectable()
export class UserSessionService {

  constructor(private prisma: PrismaService, private userSettings: UserSettingsService) { }

  async getTodaySession(userId: string): Promise<UserSessionResponse> {
    const today = new Date().toISOString().split('T')[0];
    return await this.prisma.userSession.findFirst({ where: { createdAt: { gte: new Date(today) }, userId }, include: { rounds: { orderBy: { id: 'asc' } } } });
  }

  async create(userId: string): Promise<UserSessionResponse> {
    const todaySession = await this.getTodaySession(userId);
    if (todaySession) return todaySession;
    const settings = await this.userSettings.getUserSessionInterval(userId)
    if (!settings) throw new NotFoundException('Настройки пользователя отсутствуют!')
    return await this.prisma.userSession.create({ data: { rounds: { createMany: { data: Array.from({ length: settings.intervalsCount }, () => ({ totalSeconds: 0 })) } }, user: { connect: { id: userId } } }, include: { rounds: true } });
  }

  async update(id: string, userId: string, dto: Partial<UserSessionDto>): Promise<SessionResponse> {
    return await this.prisma.userSession.update({ where: { userId, id }, data: dto });
  }

  async updateRound(id: string, dto: Partial<UserRoundDto>): Promise<SessionRoundResponse> {
    return await this.prisma.sessionRound.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const deleteTimeBlock = await this.prisma.userSession.delete({ where: { userId, id } });
    return { message: 'Сессия успешно удалена!' };
  }
}
