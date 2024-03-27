import { Injectable } from '@nestjs/common';
import { UserSettingDto } from './dto/user-setting.dto';
import { PrismaService } from 'src/prisma.service';
import { SettingsResponse } from 'src/types';

@Injectable()
export class UserSettingsService {

  constructor(private prisma: PrismaService) { }

  async create(userId: string, dto: Partial<UserSettingDto>): Promise<SettingsResponse> {
    return await this.prisma.userSetting.create({ data: { ...dto, user: { connect: { id: userId } } } });
  }

  async findAll(userId: string): Promise<SettingsResponse> {
    return await this.prisma.userSetting.findUnique({ where: { userId } });
  }

  async update(userId: string, data: UserSettingDto): Promise<SettingsResponse> {
    return await this.prisma.userSetting.update({ where: { userId }, data });
  }

  async getUserSessionInterval(userId: string): Promise<{ intervalsCount: number }> {
    return await this.prisma.userSetting.findUnique({ where: { userId }, select: { intervalsCount: true } })
  }
}
