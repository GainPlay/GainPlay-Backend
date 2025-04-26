import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppService } from "@/app.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@/auth/auth.module";
import { AppController } from "@/app.controller";
import { PrismaModule } from "database/prisma.module";
import { GoalsModule } from "@/models/goal/goals.module";
import { UsersModule } from "@/models/users/users.module";
import { WorkoutModule } from "@/models/workout/workout.module";
import { validationSchema } from "src/config/validation.schema";
import { GlobalAuthGuard } from "@/auth/guards/globalAuth.guard";

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
  ],
})
export class AppModule {}
