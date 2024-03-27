import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class TimeBlockDto {

    @ApiProperty({ description: 'Название', example: 'example@example.com' })
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ description: 'Цвет задачи', example: 'red' })
    @IsString()
    @IsOptional()
    readonly color?: string;

    @ApiProperty({ description: 'Длительность временного блока', example: '30 мин' })
    @IsNumber()
    @IsNotEmpty()
    readonly duration: number;

    @ApiProperty({ description: 'Порядок очереди', example: '2' })
    @IsNumber()
    @IsOptional()
    readonly order?: number;
}
