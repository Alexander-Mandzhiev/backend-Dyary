import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString, IsBoolean, IsEnum, IsNotEmpty } from "class-validator";
import { Priority } from "prisma/generated/client";

export class TaskDto {

    @ApiProperty({ description: 'Задача', example: 'Убрать мусор' })
    @IsString()
    @IsOptional()
    readonly name: string;

    @ApiProperty({ description: 'Приоритет задачи', example: 'low, medium, high' })
    @IsEnum(Priority)
    @IsOptional()
    @Transform(({ value }) => ('' + value).toLocaleLowerCase())
    readonly priority?: Priority;

    @ApiProperty({ description: 'Дата создания задачи', example: '2023-06-29T11:35:09.918Z' })
    @IsString()
    @IsOptional()
    readonly createdAt?: string;

    @ApiProperty({ description: 'Выполнено?', example: 'true / false' })
    @IsBoolean()
    @IsOptional()
    readonly isCompleted?: boolean;

}
