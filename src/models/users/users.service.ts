import { users } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      include: {user_settings: true},
      where: { email }
    });
  }

  async findOneById(id: number): Promise<users | null> {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async create(userData: Omit<users, "id">): Promise<users> {
    return this.prisma.users.create({ data: userData });
  }

  async update(
    userId: number,
    userInformation: Partial<users>,
  ): Promise<users> {
    return this.prisma.users.update({
      where: { id: userId },
      data: userInformation,
    });
  }

  async findAll(): Promise<users[]> {
    return this.prisma.users.findMany();
  }

  async getUserSettings(userId: number) {
    return this.prisma.user_settings.findUnique({
      where: { user_id: userId },
    });
  }

  async updateUserSettings(userId: number, settingsData: any) {
    // First check if settings exist
    const existingSettings = await this.getUserSettings(userId);

    // Remove any fields that might cause issues
    const safeData = { ...settingsData };

    if (existingSettings) {
      // Update existing settings with individual fields
      return this.prisma.user_settings.update({
        where: { user_id: userId },
        data: {
          age: safeData.age,
          weight: safeData.weight,
          height: safeData.height,
          fitness_level: safeData.fitness_level,
          body_structure: safeData.body_structure,
          workout_duration: safeData.workout_duration,
          exercise_frequency: safeData.exercise_frequency,
        },
      });
    } else {
      // Create new settings with minimal fields
      return this.prisma.user_settings.create({
        data: {
          age: safeData.age,
          weight: safeData.weight,
          height: safeData.height,
          fitness_level: safeData.fitness_level,
          body_structure: safeData.body_structure,
          workout_duration: safeData.workout_duration,
          exercise_frequency: safeData.exercise_frequency,
          users: {
            connect: { id: userId },
          },
        },
      });
    }
  }

  async createOrUpdateUserGoal(userId: number, goalId: number, value: number) {
    // First check if user_goal exists
    const existingUserGoal = await this.prisma.user_goals.findFirst({
      where: {
        user_id: userId,
        goal_id: goalId,
      },
    });

    if (existingUserGoal) {
      // Update existing user_goal
      return this.prisma.user_goals.update({
        data: { value },
        where: { id: existingUserGoal.id },
      });
    } else {
      // Create new user_goal
      return this.prisma.user_goals.create({
        data: {
          value,
          users: {
            connect: { id: userId },
          },
          goals: {
            connect: { id: goalId },
          },
        },
      });
    }
  }
  async addBadgeToUser(userId: number, badgeId: number): Promise<users> {
    await this.prisma.user_badges.create({
      data: {
        user_id: userId,
        badge_id: badgeId,
        earned_at: new Date(),
      },
    });

    return this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        user_badges: true,
      },
    });
  }
}
