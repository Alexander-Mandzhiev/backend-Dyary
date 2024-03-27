import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsOptional } from "class-validator"

export class UserSettingDto {
    
    @ApiProperty({ description: 'Время работы', example: '45' })
    @IsNumber()
    @IsOptional()
    readonly workInterval?: number

    @ApiProperty({ description: 'Перерыв', example: '15' })
    @IsNumber()
    @IsOptional()
    readonly breakInterval?: number

    @ApiProperty({ description: 'Количество интервалов', example: 'red' })
    @IsNumber()
    @IsOptional()
    readonly intervalsCount?: number
}
