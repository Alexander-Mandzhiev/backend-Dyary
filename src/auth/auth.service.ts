import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDTO } from './dto/auth.dto';
import { verify } from 'argon2';
import type { AuthResponse, AuthTokensResponse, User, UserResponse } from 'src/types';
import { Response } from 'express';
import { MailerService } from 'src/mailer/mailer.service';
import { PrismaService } from 'src/prisma.service';
import { Status } from 'prisma/generated/client';

@Injectable()
export class AuthService {
    constructor(private jwt: JwtService, private userService: UserService, private prisma: PrismaService, private mailService: MailerService) { }

    EXPIRE_DAY_REFRESH_TOKEN = +process.env.EXPIRE_DAY_REFRESH_TOKEN;
    REFRESH_TOKEN_NAME = process.env.REFRESH_TOKEN_NAME;

    async signIn(dto: AuthDTO): Promise<AuthResponse> {
        const { password, ...user } = await this.validateUser(dto);
        if (user.status === 'pending') throw new UnauthorizedException(`Подтвердите вашу эл. почту, загляните на свой почтовый ящик!`);
        const tokens = await this.issueToken(user.id);
        return { user, ...tokens }
    }

    async signUp(dto: AuthDTO): Promise<string> {
        const userVerification = await this.userService.findOneByEmail(dto.email);
        if (userVerification && userVerification.status === Status.pending) {
            const { password, ...user } = await this.userService.update(userVerification.id, { password: dto.password })
            await this.generatePendingRecord(user)
            return `Осталось подтвердить вашу эл. почту, загляните на свой почтовый ящик!`
        }
        if (userVerification) throw new BadRequestException('Такой пользователь существует!');
        const { password, ...user } = await this.userService.create(dto);
        await this.generatePendingRecord(user)
        return `Осталось подтвердить вашу эл. почту, загляните на свой почтовый ящик!`
    }

    async confirm(token: string) {
        const userId = await this.verifyToken(token)
        const data = await this.userService.findOneById(userId.id)
        if (data && data.status === Status.pending) {
            const user = await this.userService.update(data.id, { status: 'active' })
            const tokens = await this.issueToken(user.id);
            return { user, ...tokens }
        }
        throw new BadRequestException('Ошибка подтверждения учетной записи!')
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

    private async generatePendingRecord(user: UserResponse) {
        const { id, ...data } = user
        const token = this.jwt.sign({ id }, { expiresIn: `1d` });
        const createRecordPendingUser = await this.prisma.pendingUser.create({ data: { token } })
        await this.mailService.sendEmail({ to: [{ name: user.email, address: user.email }], subject: `Регистрация на сайте daily-diary.ru`, text: token })
    }

    private async verifyToken(token: string): Promise<UserResponse> {
        const data = await this.jwt.verifyAsync(token)
        const tokenExist = await this.prisma.pendingUser.findFirst({ where: { token: data.token } });
        if (tokenExist) {
            await this.prisma.pendingUser.delete({ where: { id: tokenExist.id } });
            return data
        }
        throw new UnauthorizedException()
    }
}