import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

import { Response } from "express";
import { Public } from "@/auth/decorators";
import { AuthGuard } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { LoginResponseDTO } from "./dtos/login-response.dto";
import { RegisterRequestDto } from "./dtos/register-request.dto";
import { RegisterResponseDTO } from "./dtos/register-response.dto";

@Public()
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Request() req): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(req.user);
  }

  @Post("register")
  async register(
    @Body() registerBody: RegisterRequestDto,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    // The request is forwarded to Google
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const frontendUrl = this.configService.get<string>("FRONTEND_URL");

    try {
      const result = await this.authService.login(req.user);

      res.redirect(`${frontendUrl}/auth/callback?token=${result.access_token}`);
    } catch {
      const frontendUrl = process.env.FRONTEND_URL;
      res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }
  }
}
