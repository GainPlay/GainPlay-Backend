import { users } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({ where: { email } });
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

  async updateUserSettings(userId: number, settingsData: any) {
    return this.prisma.user_settings.upsert({
      update: settingsData,
      where: { user_id: userId },
      create: {
        user_id: userId,
        ...settingsData,
      },
    });
  }

  async createOrUpdateUserGoal(userId: number, goalId: number, value: number) {
    return this.prisma.user_goals.upsert({
      update: { value },
      create: {
        value,
        user_id: userId,
        goal_id: goalId,
      },
      where: {
        user_id_goal_id: {
          user_id: userId,
          goal_id: goalId,
        },
      },
    });
  }
}
