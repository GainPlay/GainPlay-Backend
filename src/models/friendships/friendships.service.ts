import { friendships, users } from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "@/models/users/users.repository";
import { FriendshipsRepository } from "./friendships.repository";
import { CreateFriendshipDto } from "@/models/friendships/dto/create-friendship.dto";
import { UpdateFriendshipDto } from "@/models/friendships/dto/update-friendship.dto";

@Injectable()
export class FriendshipsService {
  constructor(private readonly friendshipsRepository: FriendshipsRepository) {}

  async create(createFriendshipDto: CreateFriendshipDto): Promise<friendships> {
    return this.friendshipsRepository.create(createFriendshipDto);
  }

  async findAll(userId: number): Promise<friendships[]> {
    return this.friendshipsRepository.findAll(userId);
  }

  async findOne(id: number): Promise<friendships> {
    return this.friendshipsRepository.findOne(id);
  }

  async update(id: number, updateFriendshipDto: UpdateFriendshipDto): Promise<friendships> {
    return this.friendshipsRepository.update(id, updateFriendshipDto);
  }

  async remove(id: number): Promise<friendships> {
    return this.friendshipsRepository.remove(id);
  }
}
