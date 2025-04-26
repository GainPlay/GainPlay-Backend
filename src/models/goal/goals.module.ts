import { Module } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { GoalsService } from "@/models/goal/goals.service";
import { GoalsRepository } from "@/models/goal/goals.repository";
import { GoalsController } from "@/models/goal/goals.controller";

@Module({
  controllers: [GoalsController],
  providers: [GoalsService, GoalsRepository, PrismaService],
})
export class GoalsModule {}
