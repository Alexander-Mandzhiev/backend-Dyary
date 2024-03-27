import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { UserSettingDto } from './dto/user-setting.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SettingsResponse } from 'src/types';

@ApiTags('Настройки пользователя')
@Controller('user/settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) { }

  @ApiOkResponse({ type: SettingsResponse })
  @HttpCode(HttpStatus.OK)
  @Get()
  @Auth()
  findAll(@CurrentUser('id') userId: string) {
    return this.userSettingsService.findAll(userId);
  }

  @ApiBody({ type: UserSettingDto })
  @ApiOkResponse({ type: SettingsResponse })
  @HttpCode(HttpStatus.OK)
  @Patch()
  @Auth()
  update(@CurrentUser('id') id: string, @Body() dto: UserSettingDto) {
    return this.userSettingsService.update(id, dto);
  }

}
