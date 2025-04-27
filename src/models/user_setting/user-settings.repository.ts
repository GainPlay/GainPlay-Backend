import { Injectable } from '@nestjs/common';
import { PrismaService } from 'database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserSettingsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user_settings.findMany({
      include: {
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
    return this.prisma.user_settings.findUnique({
      where: { id },
      include: {
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
    return this.prisma.user_settings.findUnique({
      where: { user_id: userId },
      include: {
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

  async create(data: Prisma.user_settingsCreateInput) {
    return this.prisma.user_settings.create({
      data,
      include: {
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

  async update(id: number, data: Prisma.user_settingsUpdateInput) {
    return this.prisma.user_settings.update({
      where: { id },
      data,
      include: {
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

  async updateByUserId(userId: number, data: Prisma.user_settingsUpdateInput) {
    return this.prisma.user_settings.update({
      where: { user_id: userId },
      data,
      include: {
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
    return this.prisma.user_settings.delete({
      where: { id },
    });
  }

  async checkUserExists(userId: number) {
    return this.prisma.users.findUnique({
      where: { id: userId },
    });
  }
}