import { Module } from "@nestjs/common";
import { PrismaService } from "database/prisma.service";
import { UserBadgesController } from "@/models/user_badges/user-badges.controller";
import { UserBadgesService } from "./user-badges.service";
import { UserBadgesRepository } from "./user-badges.repository";

@Module({
  exports: [UserBadgesService],
  controllers: [UserBadgesController],
  providers: [UserBadgesService, UserBadgesRepository, PrismaService],
})
export class UserBadgesModule {}
