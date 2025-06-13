import { users } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { email },
      include: {
        user_settings: true,
        user_goals: {
          select: {
            goals: true,
          },
        },
        user_badges: {
          select: {
            badges: true,
          },
        },
      },
    });
  }

  async findOneById(id: number): Promise<users | null> {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async findOneByIdExpanded(id: number): Promise<(Partial<users> & { workouts_length: number }) | null> {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
      id: true,
      name: true,
      email: true,
      avatar_url: true,
      coins: true,
      level: true,
      experience: true,
      streak: true,
      finished_onboarding: true,
      created_at: true,
      user_goals: { include: { goals: true } },
      user_badges: { include: { badges: true } },
      user_settings: true,
      workouts: { select: { id: true }, where: { completed_at: { not: null } } }, // fetch workouts to count
      },
    });

    if (!user) return null;

    return {
      ...user,
      workouts_length: user.workouts ? user.workouts.length : 0,
    };
  }

  async create(userData: Omit<users, "id">): Promise<users> {
    return this.prisma.users.create({ data: userData });
  }

  async update(userId: number, body: any): Promise<users> {
    return this.prisma.users.update({
      where: { id: userId },
      data: {
        name: body.name,
        email: body.email,
        // avatar_url: body.userData.avatar,
      },
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
    const existingSettings = await this.getUserSettings(userId);
    if (existingSettings) {
      // Update existing settings
      return this.prisma.user_settings.update({
        where: { user_id: userId },
        data: {
          fitness_level: settingsData.fitness_level,
          body_structure: settingsData.body_structure,
          workout_duration: settingsData.workout_duration,
          exercise_frequency: settingsData.exercise_frequency,
          age: settingsData.age
            ? parseInt(settingsData.age.toString())
            : undefined,
          weight: settingsData.weight
            ? parseInt(settingsData.weight.toString())
            : undefined,
          height: settingsData.height
            ? parseInt(settingsData.height.toString())
            : undefined,
        },
      });
    } else {
      // Create new settings
      return this.prisma.user_settings.create({
        data: {
          user_id: userId,
          age: settingsData.age,
          weight: settingsData.weight,
          height: settingsData.height,
          fitness_level: settingsData.fitness_level,
          body_structure: settingsData.body_structure,
          workout_duration: settingsData.workout_duration,
          exercise_frequency: settingsData.exercise_frequency,
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
