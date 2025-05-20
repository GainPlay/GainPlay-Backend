import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Req,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AvatarService } from "./avatar.service";

@Controller("avatars")
export class AvatarsController {
  constructor(private readonly avatarService: AvatarService) {}

  @Get()
  async getAllAvatars() {
    try {
      return await this.avatarService.findAll();
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to get avatars",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("user")
  async getUserAvatars(@Req() req) {
    try {
      // Make sure userId is properly extracted and converted to a number
      const userId = parseInt(req.user.id);
      if (isNaN(userId)) {
        throw new HttpException("Invalid user ID", HttpStatus.BAD_REQUEST);
      }

      return await this.avatarService.getUserAvatars(userId);
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to get user avatars",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("purchase/:avatarId")
  async purchaseAvatar(
    @Req() req,
    @Param("avatarId", ParseIntPipe) avatarId: number,
  ) {
    try {
      // Make sure userId is properly extracted and converted to a number
      const userId = parseInt(req.user.id);
      if (isNaN(userId)) {
        throw new HttpException("Invalid user ID", HttpStatus.BAD_REQUEST);
      }

      return await this.avatarService.purchaseAvatar(userId, avatarId);
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to purchase avatar",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("set-current/:avatarId")
  async setCurrentAvatar(
    @Req() req,
    @Param("avatarId", ParseIntPipe) avatarId: number,
  ) {
    try {
      // Make sure userId is properly extracted and converted to a number
      const userId = parseInt(req.user.id);
      if (isNaN(userId)) {
        throw new HttpException("Invalid user ID", HttpStatus.BAD_REQUEST);
      }

      return await this.avatarService.setCurrentAvatar(userId, avatarId);
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to set current avatar",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
