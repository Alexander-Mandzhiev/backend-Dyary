import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, Matches, MinLength } from "class-validator";
import { MESSAGES, REGEX } from "src/util";

export class AuthDTO {

    @ApiProperty({ example: 'example@example.com' })
    @IsNotEmpty()
    @MinLength(5, { message: 'E-mail must be at least 5 character long'})
    @IsEmail()
    readonly email: string;

    @ApiProperty({ example: 'Пример пароля 123' })
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    @IsString()
    readonly password: string;
}