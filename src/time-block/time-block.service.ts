import { Injectable } from '@nestjs/common';
import { TimeBlockDto } from './dto/time-block.dto';
import { PrismaService } from 'src/prisma.service';
import { TimeBlockResponse } from 'src/types';

@Injectable()
export class TimeBlockService {

  constructor(private prisma: PrismaService) { }

  async create(dto: TimeBlockDto, userId: string): Promise<TimeBlockResponse> {
    return await this.prisma.timeBlock.create({ data: { ...dto, user: { connect: { id: userId } } } });
  }

  async findAll(userId: string): Promise<TimeBlockResponse[]> {
    return await this.prisma.timeBlock.findMany({ where: { userId }, orderBy: { order: 'asc' } });
  }

  async update(id: string, userId: string, dto: Partial<TimeBlockDto>): Promise<TimeBlockResponse> {
    return await this.prisma.timeBlock.update({ where: { userId, id }, data: dto });
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const deleteTimeBlock = await this.prisma.timeBlock.delete({ where: { userId, id } });
    return { message: 'Временной блок успешно удален!' };
  }

  async updateOrder(ids: string[]): Promise<TimeBlockResponse[]> {
    return await this.prisma.$transaction(ids.map((id, order) => this.prisma.timeBlock.update({ where: { id }, data: { order } })))
  }
}