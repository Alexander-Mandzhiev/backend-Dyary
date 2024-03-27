import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { TimeBlockModule } from './time-block/time-block.module';
import { UserSessionModule } from './user-session/user-session.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { MailerModule } from './mailer/mailer.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    TaskModule,
    TimeBlockModule,
    UserSessionModule,
    UserSettingsModule,
    MailerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
