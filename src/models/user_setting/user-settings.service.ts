import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserSettingsService {
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

  async findOne(id: number) {
    const userSettings = await this.prisma.user_settings.findUnique({
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

    if (!userSettings) {
      throw new NotFoundException(`User settings with ID ${id} not found`);
    }

    return userSettings;
  }

  async findByUser(userId: number) {
    const userSettings = await this.prisma.user_settings.findUnique({
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

    if (!userSettings) {
      throw new NotFoundException(
        `User settings for user ID ${userId} not found`
      );
    }

    return userSettings;
  }

  async create(data: Prisma.user_settingsCreateInput) {
    // Check if settings already exist for this user
    const existingSettings = await this.prisma.user_settings.findUnique({
      where: { user_id: Number(data.users.connect.id) },
    });

    if (existingSettings) {
      throw new Error(
        `Settings already exist for user ID ${data.users.connect.id}`
      );
    }

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
    await this.findOne(id); // Verify the record exists

    return this.prisma.user_settings.update({
      where: { id },
      data: { ...data, updated_at: new Date() },
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
    const userSettings = await this.prisma.user_settings.findUnique({
      where: { user_id: userId },
    });

    if (!userSettings) {
      throw new NotFoundException(
        `User settings for user ID ${userId} not found`
      );
    }

    return this.prisma.user_settings.update({
      where: { user_id: userId },
      data: { ...data, updated_at: new Date() },
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

  async remove(id: number) {
    await this.findOne(id); // Verify the record exists

    return this.prisma.user_settings.delete({ where: { id } });
  }

  async upsert(userId: number, data: Prisma.user_settingsUpdateInput) {
    // Check if user exists
    const user = await this.prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Try to find existing settings
    const existingSettings = await this.prisma.user_settings.findUnique({
      where: { user_id: userId },
    });

    if (existingSettings) {
      // Update existing settings
      return this.updateByUserId(userId, data);
    } else {
      // Create new settings
      return this.prisma.user_settings.create({
        data: { 
          users: { connect: { id: userId } },
          exercise_frequency: data.exercise_frequency as number | null,
          fitness_level: data.fitness_level as number | null,
          created_at: data.created_at as Date | string | null,
          updated_at: data.updated_at as Date | string | null,
        },
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
  }
}
