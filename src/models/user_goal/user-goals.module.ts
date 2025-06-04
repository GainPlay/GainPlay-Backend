import { Module } from "@nestjs/common";
import { PrismaModule } from "database/prisma.module";
import { GeminiService } from "@/models/user_goal/gemini.service";
import { UserGoalsService } from "./user-goals.service";
import { UserGoalsController } from "./user-goals.controller";
import { UserGoalsRepository } from "./user-goals.repository";

@Module({
  imports: [PrismaModule],
  exports: [UserGoalsService],
  controllers: [UserGoalsController],
  providers: [UserGoalsService, UserGoalsRepository, GeminiService],
})
export class UserGoalsModule {}
