import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppService } from "@/app.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@/auth/auth.module";
import { AppController } from "@/app.controller";
import { PrismaModule } from "database/prisma.module";
import { UsersModule } from "@/models/users/users.module";
import { validationSchema } from "src/config/validation.schema";
<<<<<<< HEAD
import { WorkoutModule } from "@/models/workout/workout.module";
import { GlobalAuthGuard } from "@/auth/guards/globalAuth.guard";
=======
import { ExamplesModule } from "@/models/examples/examples.module";
import { WorkoutModule } from '@/models/workout/workout.module';
import { GoalsModule } from "@/models/goal/goals.module";
>>>>>>> f0a3126e893be3f9ba3ed7ebd113a6a7bbc13c22

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
<<<<<<< HEAD
    UsersModule,
=======
    GoalsModule
>>>>>>> f0a3126e893be3f9ba3ed7ebd113a6a7bbc13c22
  ],
})
export class AppModule {}
