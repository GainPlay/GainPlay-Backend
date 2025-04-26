import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserGoalsService {
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

  async findOne(id: number) {
    const userGoal = await this.prisma.user_goals.findUnique({
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

    if (!userGoal) {
      throw new NotFoundException(`User goal with ID ${id} not found`);
    }

    return userGoal;
  }

  async findByUser(userId: number) {
    return this.prisma.user_goals.findMany({
      where: { user_id: userId },
      include: { goals: true },
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
    await this.findOne(id); // Verify the record exists

    return this.prisma.user_goals.update({
      where: { id },
      data: { ...data, updated_at: new Date() },
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

  async remove(id: number) {
    await this.findOne(id); // Verify the record exists

    return this.prisma.user_goals.delete({ where: { id } });
  }

  async updateValue(id: number, value: number) {
    await this.findOne(id); // Verify the record exists

    return this.prisma.user_goals.update({
      where: { id },
      data: { value, updated_at: new Date() },
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
}
