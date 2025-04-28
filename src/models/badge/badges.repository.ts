import { Injectable } from '@nestjs/common';
import { badges, Prisma } from '@prisma/client';
import { PrismaService } from 'database/prisma.service';

@Injectable()
export class BadgesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<badges[]> {
    return this.prisma.badges.findMany();
  }

  async findOne(id: number): Promise<badges | null> {
    return this.prisma.badges.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.badgesCreateInput): Promise<badges> {
    return this.prisma.badges.create({
      data,
    });
  }

  async update(id: number, data: Prisma.badgesUpdateInput): Promise<badges> {
    return this.prisma.badges.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<badges> {
    return this.prisma.badges.delete({
      where: { id },
    });
  }
}
