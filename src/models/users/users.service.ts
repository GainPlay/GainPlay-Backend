import { users } from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "@/models/users/users.repository";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(): Promise<users[]> {
    const users = await this.usersRepository.findAll();
    return users.map(user => user);
  }

  async findByEmail(email: string): Promise<users> {
    const user = await this.usersRepository.findOneByEmail(email);

    return user;
  }

  async findById(id: number): Promise<users> {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async createUser(userData: Omit<users, "id">): Promise<users> {
    return this.usersRepository.create(userData);
  }

  async updateUser(userId: number, userData: Partial<users>): Promise<users> {
    await this.findById(userId);
    return this.usersRepository.update(userId, userData);
  }

  async addBadgeToUser(userId: number, badgeId: number): Promise<users> {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const updatedUser = await this.usersRepository.addBadgeToUser(
      userId,
      badgeId,
    );

    return updatedUser;
  }
}
