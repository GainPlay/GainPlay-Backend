import { Module } from "@nestjs/common";
import { AppService } from "@/app.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@/auth/auth.module";
import { AppController } from "@/app.controller";
import { PrismaModule } from "database/prisma.module";
import { validationSchema } from "src/config/validation.schema";
import { ExamplesModule } from "@/models/examples/examples.module";

@Module({
  controllers: [AppController],
  providers: [
    AppService
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
      envFilePath: `src/config/env/.env.${process.env.NODE_ENV}`,
    }),
    PrismaModule,
    ExamplesModule,
    AuthModule,
  ],
})
export class AppModule {}
