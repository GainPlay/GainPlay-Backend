import { Injectable } from '@nestjs/common';
import { PrismaService } from 'database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserGoalsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user_goals.findMany({
      include: {
        goals: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar_url: true,
            level: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user_goals.findUnique({
      where: { id },
      include: {
        goals: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar_url: true,
            level: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.user_goals.findMany({
      where: { user_id: userId },
      include: {
        goals: true,
      },
    });
  }

  async create(data: Prisma.user_goalsCreateInput) {
    return this.prisma.user_goals.create({
      data,
      include: {
        goals: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar_url: true,
            level: true,
          },
        },
      },
    });
  }

  async update(id: number, data: Prisma.user_goalsUpdateInput) {
    return this.prisma.user_goals.update({
      where: { id },
      data,
      include: {
        goals: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar_url: true,
            level: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.user_goals.delete({
      where: { id },
    });
  }
}