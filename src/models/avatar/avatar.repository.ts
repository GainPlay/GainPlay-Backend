import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { avatars, user_avatars, users } from "@prisma/client";
import { CreateAvatarDto } from "./dto/create-avatar.dto";
import { UpdateAvatarDto } from "./dto/update-avatar.dto";

@Injectable()
export class AvatarRepository {
  constructor(private prisma: PrismaService) {}

  // Basic CRUD operations for avatars
  async findAll(): Promise<avatars[]> {
    return this.prisma.avatars.findMany({
      orderBy: { price: "asc" },
    });
  }

  async findOne(id: number): Promise<avatars | null> {
    return this.prisma.avatars.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<avatars | null> {
    return this.prisma.avatars.findFirst({
      where: { name },
    });
  }

  async create(data: CreateAvatarDto): Promise<avatars> {
    return this.prisma.avatars.create({
      data,
    });
  }

  async update(id: number, data: UpdateAvatarDto): Promise<avatars> {
    return this.prisma.avatars.update({
      data,
      where: { id },
    });
  }

  async remove(id: number): Promise<avatars> {
    return this.prisma.avatars.delete({
      where: { id },
    });
  }

  // User avatar operations
  async getUserAvatars(
    userId: number,
  ): Promise<(user_avatars & { avatars: avatars })[]> {
    return this.prisma.user_avatars.findMany({
      where: { user_id: userId },
      include: { avatars: true },
    });
  }

  async findUserAvatar(
    userId: number,
    avatarId: number,
  ): Promise<user_avatars | null> {
    return this.prisma.user_avatars.findFirst({
      where: {
        user_id: userId,
        avatar_id: avatarId,
      },
    });
  }

  async createUserAvatar(
    userId: number,
    avatarId: number,
    isCurrent: boolean,
  ): Promise<user_avatars> {
    return this.prisma.user_avatars.create({
      data: {
        user_id: userId,
        avatar_id: avatarId,
        is_current: isCurrent,
      },
    });
  }

  async updateAllUserAvatars(
    userId: number,
    data: any,
  ): Promise<{ count: number }> {
    return this.prisma.user_avatars.updateMany({
      data,
      where: { user_id: userId },
    });
  }

  async updateUserAvatar(userId: number, avatarId: any): Promise<users> {
    const avatar = await this.prisma.avatars.findFirst({
      select: { image_url: true },
      where: { id: avatarId },
    });

    return await this.prisma.users.update({
      data: { avatar_url: avatar?.image_url ?? null },
      where: { id: userId },
    });
  }

  // User operations (needed for avatar purchases)
  async findUser(userId: number): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { id: userId },
    });
  }

  async updateUser(userId: number, data: any): Promise<users> {
    return this.prisma.users.update({
      data,
      where: { id: userId },
    });
  }

  // Transaction helper
  async executeTransaction<T>(fn: (prisma: any) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
