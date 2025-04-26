import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";

@Injectable()
export class GoalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.goals.findMany();
  }
}
