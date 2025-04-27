import { Module } from "@nestjs/common";
import { PrismaModule } from "database/prisma.module";
import { UserGoalsService } from "./user-goals.service";
import { UserGoalsController } from "./user-goals.controller";
import { UserGoalsRepository } from "./user-goals.repository";

@Module({
  imports: [PrismaModule],
  exports: [UserGoalsService],
  controllers: [UserGoalsController],
  providers: [UserGoalsService, UserGoalsRepository],
})
export class UserGoalsModule {}
