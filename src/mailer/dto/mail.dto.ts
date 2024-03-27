import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { Address } from "nodemailer/lib/mailer";

export class SendEmailDTO {

    @ApiProperty({ description: 'E-mail пользователя', example: 'example@example.com' })
    @IsOptional()
    readonly from?: Address;

    @ApiProperty({ description: 'E-mail пользователя', example: 'example@example.com' })
    @IsOptional()
    readonly to?: Address[];

    @ApiProperty({ description: 'E-mail пользователя', example: 'example@example.com' })
    @IsOptional()
    @IsString()
    readonly subject?: string;

    @ApiProperty({ description: 'E-mail пользователя', example: 'example@example.com' })
    @IsOptional()
    @IsString()
    readonly html?: string;

    @ApiProperty({ description: 'E-mail пользователя', example: 'example@example.com' })
    @IsOptional()
    @IsString()
    readonly text?: string;

    @ApiProperty({ description: 'E-mail пользователя', example: 'example@example.com' })
    @IsOptional()
    readonly placeholderReplacements?: Record<string, string>;
}