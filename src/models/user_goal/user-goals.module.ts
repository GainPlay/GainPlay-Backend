import { Module } from "@nestjs/common";
import { UserGoalsController } from "./user-goals.controller";
import { UserGoalsService } from "./user-goals.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [UserGoalsController],
  providers: [UserGoalsService],
  exports: [UserGoalsService],
})
export class UserGoalsModule {}
