import { Injectable } from "@nestjs/common";
import { user_badges, Prisma } from "@prisma/client";
import { PrismaService } from "database/prisma.service";

@Injectable()
export class UserBadgesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<user_badges[]> {
    return this.prisma.user_badges.findMany();
  }

  async findOne(id: number): Promise<user_badges | null> {
    return this.prisma.user_badges.findUnique({
      where: { id },
    });
  }

  async findByUser(userId: number): Promise<user_badges[]> {
    return this.prisma.user_badges.findMany({
      where: { user_id: userId },
    });
  }

  async findByBadge(badgeId: number): Promise<user_badges[]> {
    return this.prisma.user_badges.findMany({
      where: { badge_id: badgeId },
    });
  }

  async findByUserAndBadge(
    userId: number,
    badgeId: number,
  ): Promise<user_badges | null> {
    return this.prisma.user_badges.findFirst({
      where: {
        user_id: userId,
        badge_id: badgeId,
      },
    });
  }

  async create(data: Prisma.user_badgesCreateInput): Promise<user_badges> {
    return this.prisma.user_badges.create({
      data,
    });
  }

  async update(
    id: number,
    data: Prisma.user_badgesUpdateInput,
  ): Promise<user_badges> {
    return this.prisma.user_badges.update({
      data,
      where: { id },
    });
  }

  async remove(id: number): Promise<user_badges> {
    return this.prisma.user_badges.delete({
      where: { id },
    });
  }
}
