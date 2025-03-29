import { GoalsService } from "@/models/goal/goals.service";
import { GoalsRepository } from "@/models/goal/goals.repository";
import { Module } from "@nestjs/common";
import { GoalsController } from "@/models/goal/goals.controller";
import { PrismaService } from "database/prisma.service";

@Module({
  controllers: [GoalsController],
  providers: [GoalsService, GoalsRepository , PrismaService],
})
export class GoalsModule {}
