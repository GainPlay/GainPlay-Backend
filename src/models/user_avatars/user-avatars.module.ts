import { Module } from "@nestjs/common";
import { PrismaModule } from "database/prisma.module";
import { UsersModule } from "@/models/users/users.module";
import { AvatarModule } from "@/models/avatar/avatar.module";
import { UserAvatarsService } from "@/models/user_avatars/user-avatars.service";
import { UserAvatarsController } from "@/models/user_avatars/user-avatars.controller";
import { UserAvatarsRepository } from "@/models/user_avatars/user-avatars.repository";

@Module({
  exports: [UserAvatarsService],
  controllers: [UserAvatarsController],
  imports: [PrismaModule, UsersModule, AvatarModule],
  providers: [UserAvatarsRepository, UserAvatarsService],
})
export class UserAvatarsModule {}
