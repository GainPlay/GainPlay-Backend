import { Module } from "@nestjs/common";
import { PrismaModule } from "database/prisma.module";
import { UserSettingsService } from "./user-settings.service";
import { UserSettingsController } from "./user-settings.controller";
import { UserSettingsRepository } from "./user-settings.repository";

@Module({
  imports: [PrismaModule],
  exports: [UserSettingsService],
  controllers: [UserSettingsController],
  providers: [UserSettingsService, UserSettingsRepository],
})
export class UserSettingsModule {}
