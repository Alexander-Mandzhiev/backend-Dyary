import { Controller, Get, Body, Patch, UsePipes, ValidationPipe, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DeleteMessage, UpdateUserResponce, UserProfileResponse } from 'src/types';

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOkResponse({ type: UserProfileResponse })
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @Auth()
  async findOne(@CurrentUser('id') id: string) {
    return await this.userService.getProfile(id);
  }

  @ApiBody({ type: UpdateUserResponce })
  @ApiOkResponse({ type: UpdateUserResponce })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Patch('profile')
  @Auth()
  async update(@CurrentUser('id') id: string, @Body() dto: UserDto) {
    return await this.userService.update(id, dto);
  }

  @ApiOkResponse({ type: DeleteMessage })
  @HttpCode(HttpStatus.OK)
  @Delete('profile')
  @Auth()
  async remove(@CurrentUser('id') id: string) {
    return await this.userService.remove(id);
  }
}
