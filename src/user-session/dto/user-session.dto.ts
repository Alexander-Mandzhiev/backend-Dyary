import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class UserSessionDto {
    @ApiProperty({ description: 'Прошла ли сессия пользователя', example: 'true, false' })
    @IsOptional()
    @IsBoolean()
    isCompleted: boolean
}
