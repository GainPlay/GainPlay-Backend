import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { Challenge, getCurrentChallenge } from "@/models/challenge/type";

@Injectable()
export class ChallengeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getTodaysChallenge(): Promise<Challenge> {
    const c = getCurrentChallenge();
    console.log({ c })
    return c
  }

  async findOneById(userId: number) {
    return this.prisma.users.findUnique({ where: { id: userId } });
  }

  async updateUserAfterChallenge(userId: number, coins: number) {
    return this.prisma.users.update({
      where: { id: userId },
      data: {
        coins,
      },
    });
  }
}
