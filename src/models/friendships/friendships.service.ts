import { friendships } from "@prisma/client";
import { Injectable } from "@nestjs/common";
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

  async update(updateFriendshipDto: UpdateFriendshipDto): Promise<friendships> {
    return this.friendshipsRepository.update(updateFriendshipDto);
  }

  async remove(id: number): Promise<friendships> {
    return this.friendshipsRepository.remove(id);
  }
}
