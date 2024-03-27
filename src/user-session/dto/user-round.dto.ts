import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UserRoundDto {
    @ApiProperty({ description: 'Время работы сессии в секундах', example: '3000' })
    @IsNumber()
    @IsNotEmpty()
    totalSeconds: number

    @ApiProperty({ description: 'Прошел раунд пользователя - да или нет', example: 'true, false' })
    @IsOptional()
    @IsBoolean()
    isCompleted: boolean
}
