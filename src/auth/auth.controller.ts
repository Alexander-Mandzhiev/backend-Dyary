import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { Request, Response } from 'express';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignInResponse } from 'src/types';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @ApiBody({ type: AuthDTO })
  @ApiOkResponse({ type: SignInResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: AuthDTO, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.signIn(dto);
    await this.authService.addRefreshTokenToResponce(res, refreshToken);
    return response
  }

  @ApiBody({ type: AuthDTO })
  @ApiOkResponse({ type: SignInResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(@Body() dto: AuthDTO, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.signUp(dto);
    await this.authService.addRefreshTokenToResponce(res, refreshToken);
    return response
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin/refresh')
  async tokenUpdate(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenFromCookie = req.cookies[this.authService.REFRESH_TOKEN_NAME];
    if (!refreshTokenFromCookie) {
      this.authService.removeRefreshTokenToResponce(res);
      throw new UnauthorizedException('Токен обновления не передан!');
    }

    const { refreshToken, ...response } = await this.authService.getNewToken(refreshTokenFromCookie);
    this.authService.addRefreshTokenToResponce(res, refreshToken);
    return response
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenToResponce(res);
    return true
  }
}
