import { user_badges, Prisma } from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserBadgesRepository } from "./user-badges.repository";

@Injectable()
export class UserBadgesService {
  constructor(private userBadgesRepository: UserBadgesRepository) {}

  async findAll(): Promise<user_badges[]> {
    return this.userBadgesRepository.findAll();
  }

  async findOne(id: number): Promise<user_badges> {
    const userBadge = await this.userBadgesRepository.findOne(id);
    if (!userBadge) {
      throw new NotFoundException(`User badge with ID ${id} not found`);
    }
    return userBadge;
  }

  async findByUser(userId: number): Promise<user_badges[]> {
    return this.userBadgesRepository.findByUser(userId);
  }

  async findByBadge(badgeId: number): Promise<user_badges[]> {
    return this.userBadgesRepository.findByBadge(badgeId);
  }

  async create(data: Prisma.user_badgesCreateInput): Promise<user_badges> {
    return this.userBadgesRepository.create(data);
  }

  async update(
    id: number,
    data: Prisma.user_badgesUpdateInput,
  ): Promise<user_badges> {
    await this.findOne(id); // Check if exists
    return this.userBadgesRepository.update(id, data);
  }

  async remove(id: number): Promise<user_badges> {
    await this.findOne(id); // Check if exists
    return this.userBadgesRepository.remove(id);
  }

  async assignBadgeToUser(
    userId: number,
    badgeId: number,
  ): Promise<user_badges> {
    // Check if the user already has this badge
    const existingBadge = await this.userBadgesRepository.findByUserAndBadge(
      userId,
      badgeId,
    );
    if (existingBadge) {
      return existingBadge;
    }

    // Create a new user badge relationship
    return this.userBadgesRepository.create({
      users: {
        connect: { id: userId },
      },
      badges: {
        connect: { id: badgeId },
      },
    });
  }
}
