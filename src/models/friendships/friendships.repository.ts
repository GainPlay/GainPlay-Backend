import { friendships, users } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { FRIENDSHIP_STATUSES } from "@/models/friendships/constants/friendship.consts";
import { UpdateFriendshipDto } from "@/models/friendships/dto/update-friendship.dto";
import { CreateFriendshipDto } from "@/models/friendships/dto/create-friendship.dto";

@Injectable()
export class FriendshipsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFriendshipDto: CreateFriendshipDto): Promise<friendships> {
    return this.prisma.friendships.create({ data: createFriendshipDto });
  }

  async findAll(userId: number): Promise<friendships[]> {
    return this.prisma.friendships.findMany({ where: { user_id: userId } });
  }

  async findOne(id: number): Promise<friendships> {
    return this.prisma.friendships.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateFriendshipDto: UpdateFriendshipDto): Promise<friendships> {
    return this.prisma.friendships.update({
      where: { id: id },
      data: updateFriendshipDto,
    });
  }

  async remove(id: number): Promise<friendships> {
    return this.prisma.friendships.delete({
      where: { id },
    });
  }
}
