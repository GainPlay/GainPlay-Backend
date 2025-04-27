import { Injectable } from "@nestjs/common";
import { user_avatars } from "@prisma/client";
import { PrismaService } from "database/prisma.service";
import { CreateUserAvatarDto } from "@/models/user_avatars/dto/user-avatars-create.dto";
import { UpdateUserAvatarDto } from "@/models/user_avatars/dto/user-avatars-update.dto";

@Injectable()
export class UserAvatarsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<user_avatars[]> {
    return this.prisma.user_avatars.findMany({
      include: {
        avatars: true,
      },
    });
  }

  async findOneById(id: number): Promise<user_avatars | null> {
    return this.prisma.user_avatars.findUnique({
      where: { id },
      include: {
        avatars: true,
      },
    });
  }

  async findByUserId(userId: number): Promise<user_avatars[]> {
    return this.prisma.user_avatars.findMany({
      where: { user_id: userId },
      include: {
        avatars: true,
      },
    });
  }

  async findCurrentByUserId(userId: number): Promise<user_avatars | null> {
    return this.prisma.user_avatars.findFirst({
      include: {
        avatars: true,
      },
      where: {
        user_id: userId,
        is_current: true,
      },
    });
  }

  async create(data: CreateUserAvatarDto): Promise<user_avatars> {
    // If this avatar is set as current, reset all others
    if (data.is_current) {
      await this.resetCurrentAvatars(data.user_id);
    }

    return this.prisma.user_avatars.create({
      data,
      include: {
        avatars: true,
      },
    });
  }

  async update(id: number, data: UpdateUserAvatarDto): Promise<user_avatars> {
    const userAvatar = await this.prisma.user_avatars.findUnique({
      where: { id },
    });

    // If setting this avatar as current, reset all others for this user
    if (data.is_current && userAvatar) {
      await this.resetCurrentAvatars(userAvatar.user_id);
    }

    return this.prisma.user_avatars.update({
      data,
      where: { id },
      include: {
        avatars: true,
      },
    });
  }

  async delete(id: number): Promise<user_avatars> {
    return this.prisma.user_avatars.delete({
      where: { id },
      include: {
        avatars: true,
      },
    });
  }

  private async resetCurrentAvatars(userId: number): Promise<void> {
    await this.prisma.user_avatars.updateMany({
      data: { is_current: false },
      where: {
        user_id: userId,
        is_current: true,
      },
    });
  }
}
