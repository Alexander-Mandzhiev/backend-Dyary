import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class UpdateOrderDto {
    @ApiProperty({ description: 'Порядок очереди задач', example: '2,1,3' })
    @IsArray()
    @IsString({ each: true })
    readonly ids: string[]
}