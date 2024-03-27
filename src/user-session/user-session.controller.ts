import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserSessionService } from './user-session.service';
import { UserSessionDto } from './dto/user-session.dto';
import { UserRoundDto } from './dto/user-round.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DeleteMessage, SessionResponse, SessionRoundResponse, UserSessionResponse } from 'src/types';

@ApiTags('Сессии пользователя')
@Controller('user/session')
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) { }

  @ApiOkResponse({ type: UserSessionResponse })
  @HttpCode(HttpStatus.OK)
  @Post()
  @Auth()
  create(@CurrentUser('id') userId: string) {
    return this.userSessionService.create(userId);
  }

  @ApiOkResponse({ type: UserSessionResponse })
  @HttpCode(HttpStatus.OK)
  @Get('today')
  @Auth()
  getTodaySession(@CurrentUser('id') userId: string) {
    return this.userSessionService.getTodaySession(userId);
  }

  @ApiBody({ type: UserSessionDto })
  @ApiOkResponse({ type: SessionRoundResponse })
  @HttpCode(HttpStatus.OK)
  @Patch('round/:id')
  @Auth()
  updateRound(@Param('id') id: string, @Body() dto: UserRoundDto) {
    return this.userSessionService.updateRound(id, dto);
  }

  @ApiBody({ type: UserSessionDto })
  @ApiOkResponse({ type: SessionResponse })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: UserSessionDto) {
    return this.userSessionService.update(id, userId, dto);
  }


  @ApiOkResponse({ type: DeleteMessage })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.userSessionService.remove(id, userId);
  }
}
