import { Module } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsController } from './user-settings.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UserSettingsController],
  providers: [UserSettingsService, PrismaService],
  exports: [UserSettingsService]
})
export class UserSettingsModule { }
