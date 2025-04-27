import { Module } from "@nestjs/common";
import { UserGoalsController } from "./user-goals.controller";
import { UserGoalsService } from "./user-goals.service";
import { UserGoalsRepository } from './user-goals.repository';
import { PrismaModule } from "database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [UserGoalsController, UserGoalsRepository],
  providers: [UserGoalsService],
  exports: [UserGoalsService],
})
export class UserGoalsModule {}
