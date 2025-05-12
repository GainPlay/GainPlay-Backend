import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppService } from "@/app.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@/auth/auth.module";
import { AppController } from "@/app.controller";
import { PrismaModule } from "database/prisma.module";
import { GoalsModule } from "@/models/goal/goals.module";
import { UsersModule } from "@/models/users/users.module";
import { AvatarModule } from "@/models/avatar/avatar.module";
import { WorkoutModule } from "@/models/workout/workout.module";
import { validationSchema } from "src/config/validation.schema";
import { GlobalAuthGuard } from "@/auth/guards/globalAuth.guard";
import { UserGoalsModule } from "@/models/user_goal/user-goals.module";
import { UserAvatarsModule } from "@/models/user_avatars/user-avatars.module";
import { UserSettingsModule } from "@/models/user_setting/user-settings.module";
import { UserBadgesModule } from "@/models/user_badges/user-badges.module";
import { BadgesModule } from "@/models/badge/badges.module";
import { ExerciseSetsModule } from "@/models/exercise_sets/exercise-sets.module";
import { ChatModule } from "@/models/chat/chat.module";
@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
      envFilePath: `src/config/env/.env.${process.env.NODE_ENV}`,
    }),
    PrismaModule,
    AuthModule,
    WorkoutModule,
    UsersModule,
    GoalsModule,
    ExerciseSetsModule,
    ChatModule,
    BadgesModule,
    UserGoalsModule,
    UserBadgesModule,
    UserSettingsModule,
    AvatarModule,
    UserAvatarsModule,
  ],
})
export class AppModule {}
