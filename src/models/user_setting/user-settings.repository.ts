import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";

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
            level: true,
            avatar_url: true,
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
            level: true,
            avatar_url: true,
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
            level: true,
            avatar_url: true,
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
            level: true,
            avatar_url: true,
          },
        },
      },
    });
  }

  async update(id: number, data: Prisma.user_settingsUpdateInput) {
    return this.prisma.user_settings.update({
      data,
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            level: true,
            avatar_url: true,
          },
        },
      },
    });
  }

  async updateByUserId(userId: number, data: Prisma.user_settingsUpdateInput) {
    return this.prisma.user_settings.update({
      data,
      where: { user_id: userId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            level: true,
            avatar_url: true,
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
