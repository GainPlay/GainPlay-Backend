import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { avatars } from '@prisma/client';
import { CreateAvatarDto, UpdateAvatarDto } from './avatar.dto';

@Injectable()
export class AvatarRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<avatars[]> {
    return this.prisma.avatars.findMany();
  }

  async findOne(id: number): Promise<avatars | null> {
    return this.prisma.avatars.findUnique({
      where: { id },
    });
  }

  async create(data: CreateAvatarDto): Promise<avatars> {
    return this.prisma.avatars.create({
      data,
    });
  }

  async update(id: number, data: UpdateAvatarDto): Promise<avatars> {
    return this.prisma.avatars.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<avatars> {
    return this.prisma.avatars.delete({
      where: { id },
    });
  }
}
