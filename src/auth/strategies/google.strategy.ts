import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { users as User } from "@prisma/client";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "@/models/users/users.service";
import { AvatarService } from "@/models/avatar/avatar.service";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly avatarService: AvatarService,
  ) {
    super({
      scope: ["email", "profile"],
      clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
      callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, displayName } = profile;
    const email = emails[0].value;

    const existingUser = await this.usersService.findByEmail(email);

    const newUser: Omit<User, "id"> = {
      level: 1,
      streak: 0,
      coins: 500,
      email: email,
      experience: 0,
      name: displayName,
      password_hash: "",
      created_at: undefined,
      finished_onboarding: false,
      avatar_url: "https://api.dicebear.com/6.x/avataaars/svg?seed=default",
    };

    const generatedUser = await this.usersService.createUser(newUser);

    await this.avatarService.assignDefaultAvatarToUser(generatedUser.id);

    done(null, existingUser || generatedUser);
  }
}
