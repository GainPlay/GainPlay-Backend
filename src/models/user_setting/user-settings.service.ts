import { Injectable, NotFoundException } from '@nestjs/common';
import { UserSettingsRepository } from './user-settings.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserSettingsService {
  constructor(private userSettingsRepository: UserSettingsRepository) {}

  async findAll() {
    return this.userSettingsRepository.findAll();
  }

  async findOne(id: number) {
    const userSettings = await this.userSettingsRepository.findById(id);

    if (!userSettings) {
      throw new NotFoundException(`User settings with ID ${id} not found`);
    }

    return userSettings;
  }

  async findByUser(userId: number) {
    const userSettings = await this.userSettingsRepository.findByUserId(userId);

    if (!userSettings) {
      throw new NotFoundException(`User settings for user ID ${userId} not found`);
    }

    return userSettings;
  }

  async create(data: Prisma.user_settingsCreateInput) {
    // Check if settings already exist for this user
    const existingSettings = await this.userSettingsRepository.findByUserId(
      Number(data.users.connect.id)
    );

    if (existingSettings) {
      throw new Error(`Settings already exist for user ID ${data.users.connect.id}`);
    }

    return this.userSettingsRepository.create(data);
  }

  async update(id: number, data: Prisma.user_settingsUpdateInput) {
    await this.findOne(id); // Verify the record exists
    
    return this.userSettingsRepository.update(id, {
      ...data,
      updated_at: new Date(),
    });
  }

  async updateByUserId(userId: number, data: Prisma.user_settingsUpdateInput) {
    const userSettings = await this.userSettingsRepository.findByUserId(userId);

    if (!userSettings) {
      throw new NotFoundException(`User settings for user ID ${userId} not found`);
    }
    
    return this.userSettingsRepository.updateByUserId(userId, {
      ...data,
      updated_at: new Date(),
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verify the record exists
    
    return this.userSettingsRepository.delete(id);
  }

  async upsert(userId: number, data: Prisma.user_settingsUpdateInput) {
    // Check if user exists
    const user = await this.userSettingsRepository.checkUserExists(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Try to find existing settings
    const existingSettings = await this.userSettingsRepository.findByUserId(userId);

    if (existingSettings) {
      // Update existing settings
      return this.updateByUserId(userId, data);
    } else {
      // Create new settings
      return this.userSettingsRepository.create({
        users: {
          connect: { id: userId },
        },
        exercise_frequency: data.exercise_frequency as number | null,
        fitness_level: data.fitness_level as number | null,
        created_at: data.created_at as Date | string | null,
        updated_at: data.updated_at as Date | string | null,
      });
    }
  }
}