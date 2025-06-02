import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "@/models/users/users.service";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
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

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.createUser({
        level: 1,
        streak: 0,
        coins: 500,
        email: email,
        experience: 0,
        name: displayName,
        password_hash: "",
        created_at: new Date(),
        finished_onboarding: false,
        avatar_url: profile.photos?.[0]?.value || "",
      });
    }

    done(null, user);
  }
}
