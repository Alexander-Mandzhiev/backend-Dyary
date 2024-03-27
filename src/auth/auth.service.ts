import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDTO } from './dto/auth.dto';
import { verify } from 'argon2';
import { AuthResponse, AuthTokensResponse, User } from 'src/types';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private jwt: JwtService, private userService: UserService) { }

    EXPIRE_DAY_REFRESH_TOKEN = +process.env.EXPIRE_DAY_REFRESH_TOKEN;
    REFRESH_TOKEN_NAME = process.env.REFRESH_TOKEN_NAME;

    async signIn(dto: AuthDTO): Promise<AuthResponse> {
        const { password, ...user } = await this.validateUser(dto);
        const tokens = await this.issueToken(user.id);
        return { user, ...tokens }
    }


    async signUp(dto: AuthDTO): Promise<AuthResponse> {
        const userVerification = await this.userService.findOneByEmail(dto.email);
        if (userVerification) throw new BadRequestException('Такой пользователь существует!');
        const { password, ...user } = await this.userService.create(dto);
        const tokens = await this.issueToken(user.id);

        return { user, ...tokens }
    }

    private async issueToken(userId: string): Promise<AuthTokensResponse> {
        const data = { id: userId };
        const accessToken = this.jwt.sign(data, { expiresIn: `${process.env.ACCESS_JWT_EXPIRATION_TIME}` });
        const refreshToken = this.jwt.sign(data, { expiresIn: `${process.env.REFRESH_JWT_EXPIRATION_TIME}` });
        return { accessToken, refreshToken }
    }

    private async validateUser(dto: AuthDTO): Promise<User> {
        const user = await this.userService.findOneByEmail(dto.email);
        if (!user) throw new NotFoundException('Такой пользователь не существует!');
        const isValid = await verify(user.password, dto.password);
        if (!isValid) throw new UnauthorizedException('Неверный пароль пользователя!');
        return user
    }

    async addRefreshTokenToResponce(response: Response, refreshToken: String) {
        const expiresIn = new Date();
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
        return await this.cookieResponse(response, refreshToken, expiresIn)
    }

    async removeRefreshTokenToResponce(response: Response) {
        const date = new Date(0);
        return await this.cookieResponse(response, '', date);
    }

    async cookieResponse(response: Response, token: String, date: Date) {
        return response.cookie(this.REFRESH_TOKEN_NAME, token, {
            httpOnly: true,
            domain: `${process.env.DOMAIN}`,
            expires: date,
            secure: true,
            sameSite: 'lax'
        })
    }

    async getNewToken(refreshToken: string) {
        const result = await this.jwt.verifyAsync(refreshToken);
        if (!result) throw new UnauthorizedException('Неверный токен обновления!');
        const { password, ...user } = await this.userService.findOneById(result.id);
        const tokens = await this.issueToken(user.id);
        return { user, ...tokens }
    }
}