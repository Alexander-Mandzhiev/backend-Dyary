import { Module } from '@nestjs/common';
import { UserSessionService } from './user-session.service';
import { UserSessionController } from './user-session.controller';
import { PrismaService } from 'src/prisma.service';
import { UserSettingsService } from 'src/user-settings/user-settings.service';

@Module({
  controllers: [UserSessionController],
  providers: [UserSessionService, PrismaService, UserSettingsService],
})
export class UserSessionModule { }
