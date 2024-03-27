import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { TimeBlockService } from './time-block.service';
import { TimeBlockDto } from './dto/time-block.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DeleteMessage, TimeBlockOrderingReqest, TimeBlockResponse } from 'src/types';

@ApiTags('Временные блоки')
@Controller('user/time-block')
export class TimeBlockController {
  constructor(private readonly timeBlockService: TimeBlockService) { }

  @ApiBody({ type: TimeBlockDto })
  @ApiOkResponse({ type: TimeBlockResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post()
  @Auth()
  create(@Body() dto: TimeBlockDto, @CurrentUser('id') id: string) {
    return this.timeBlockService.create(dto, id);
  }

  @ApiOkResponse({ type: [TimeBlockResponse] })
  @HttpCode(HttpStatus.OK)
  @Get()
  @Auth()
  findAll(@CurrentUser('id') id: string) {
    return this.timeBlockService.findAll(id);
  }

  @ApiBody({ type: TimeBlockOrderingReqest })
  @ApiOkResponse({ type: [TimeBlockResponse]  })
  @HttpCode(HttpStatus.OK)
  @Patch('update-order')
  @Auth()
  updateOrder(@Body() dto: UpdateOrderDto) {
    return this.timeBlockService.updateOrder(dto.ids);
  }

  @ApiBody({ type: TimeBlockDto })
  @ApiOkResponse({ type: TimeBlockResponse })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: TimeBlockDto) {
    return this.timeBlockService.update(id, userId, dto);
  }

  @ApiOkResponse({ type: DeleteMessage })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.timeBlockService.remove(id, userId);
  }


}
