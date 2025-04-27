import { Module } from "@nestjs/common";
import { UserSettingsController } from "./user-settings.controller";
import { UserSettingsService } from "./user-settings.service";
import { UserSettingsRepository } from './user-settings.repository';
import { PrismaModule } from "database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [UserSettingsController],
  providers: [UserSettingsService,  UserSettingsRepository],
  exports: [UserSettingsService],
})
export class UserSettingsModule {}
