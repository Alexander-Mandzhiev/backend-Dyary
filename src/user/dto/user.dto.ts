import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches, MinLength } from "class-validator";
import { Status } from "prisma/generated/client";
import { MESSAGES, REGEX } from "src/util";

export class UserDto {

    @ApiProperty({ description: 'E-mail пользователя', example: 'example@example.com' })
    @IsOptional()
    @MinLength(5, { message: 'E-mail must be at least 5 character long' })
    @IsEmail()
    readonly email?: string;

    @ApiProperty({ description: 'Пользователь 1', example: 'example@example.com' })
    @IsOptional()
    @IsString()
    readonly username?: string;

    @ApiProperty({ description: 'Пароль пользователя', example: 'Qwerty@123' })
    @IsOptional()
    @Length(8, 24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    @IsString()
    readonly password?: string;

    @ApiProperty({ description: 'Статус пользователя', example: "pending, active, blocked:" })
    @IsEnum(Status)
    @IsOptional()
    readonly status?: Status
}
