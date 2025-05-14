import { Module } from "@nestjs/common";
import { FriendshipsService } from "@/models/friendships/friendships.service";
import { FriendshipsController } from "@/models/friendships/friendships.controller";
import { PrismaModule } from "database/prisma.module";
import { FriendshipsRepository } from "@/models/friendships/friendships.repository";

@Module({
  exports: [FriendshipsService],
  controllers: [FriendshipsController],
  providers: [FriendshipsService, FriendshipsRepository],
  imports: [PrismaModule],
})
export class FriendshipsModule {}
