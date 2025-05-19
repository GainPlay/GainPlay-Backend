// Update the auth module to include AvatarsModule
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "@/models/users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "@/auth/strategies/jwt.strategy";
import { AvatarModule } from "@/models/avatar/avatar.module";
import { LocalStrategy } from "@/auth/strategies/local.strategy";
import { GoogleStrategy } from "@/auth/strategies/google.strategy";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  imports: [
    UsersModule,
    AvatarModule, // Add the AvatarsModule to import the AvatarService
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: parseInt(
            configService.getOrThrow<string>(
              "ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC",
            ),
          ),
        },
      }),
    }),
  ],
})
export class AuthModule {}
