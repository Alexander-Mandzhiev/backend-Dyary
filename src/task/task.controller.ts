import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './dto/task.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DeleteMessage, TaskResponse } from 'src/types';

@ApiTags('Задачи - планы')
@Controller('user/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @UsePipes(new ValidationPipe())
  @ApiBody({ type: TaskDto })
  @ApiOkResponse({ type: TaskResponse })
  @HttpCode(HttpStatus.OK)
  @Post()
  @Auth()
  create(@Body() dto: TaskDto, @CurrentUser('id') id: string) {
    return this.taskService.create(dto, id);
  }

  @ApiOkResponse({ type: [TaskResponse] })
  @HttpCode(HttpStatus.OK)
  @Get()
  @Auth()
  findAll(@CurrentUser('id') id: string, @Query('search') search: string) {
    return this.taskService.findAll(id, search);
  }

  @UsePipes(new ValidationPipe())
  @ApiBody({ type: TaskDto })
  @ApiOkResponse({ type: TaskResponse })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Auth()
  update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: TaskDto) {
    return this.taskService.update(dto, id, userId);
  }

  @ApiOkResponse({ type: DeleteMessage })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.taskService.remove(id, userId);
  }
}
