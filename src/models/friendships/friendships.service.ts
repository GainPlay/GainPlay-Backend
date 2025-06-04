import { Injectable } from "@nestjs/common";
import { friendships, users } from "@prisma/client";
import { CreateFriendshipDto } from "@/models/friendships/dto/create-friendship.dto";
import { UpdateFriendshipDto } from "@/models/friendships/dto/update-friendship.dto";
import { FriendshipsRepository } from "./friendships.repository";

@Injectable()
export class FriendshipsService {
  constructor(private readonly friendshipsRepository: FriendshipsRepository) {}

  async create(createFriendshipDto: CreateFriendshipDto): Promise<friendships> {
    return await this.friendshipsRepository.create(createFriendshipDto);
  }

  async findAll(userId: number): Promise<friendships[]> {
    return await this.friendshipsRepository.findAll(userId);
  }

  async findAllDiscover(userId: number): Promise<Partial<users>[]> {
    return await this.friendshipsRepository.findAllDiscover(userId);
  }

  async findOneByUsers(
    user_id: number,
    friend_id: number,
  ): Promise<friendships> {
    return await this.friendshipsRepository.findOneByUsers(user_id, friend_id);
  }

  async update(
    id: number,
    updateFriendshipDto: UpdateFriendshipDto,
  ): Promise<friendships> {
    return await this.friendshipsRepository.update(id, updateFriendshipDto);
  }

  async remove(id: number): Promise<friendships> {
    return await this.friendshipsRepository.remove(id);
  }
}
