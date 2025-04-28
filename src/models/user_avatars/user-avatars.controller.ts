import { UserAvatarsService } from "@/models/user_avatars/user-avatars.service";
import { CreateUserAvatarDto } from "@/models/user_avatars/dto/user-avatars-create.dto";
import { UpdateUserAvatarDto } from "@/models/user_avatars/dto/user-avatars-update.dto";
import { UserAvatarResponseDto } from "@/models/user_avatars/dto/user-avatars-response.dto";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from "@nestjs/common";

@Controller("user-avatars")
export class UserAvatarsController {
  constructor(private readonly userAvatarsService: UserAvatarsService) {}

  @Post()
  create(
    @Body() createUserAvatarDto: CreateUserAvatarDto,
  ): Promise<UserAvatarResponseDto> {
    return this.userAvatarsService.create(createUserAvatarDto);
  }

  @Get()
  findAll(@Query("userId") userId?: string): Promise<UserAvatarResponseDto[]> {
    if (userId) {
      return this.userAvatarsService.findByUserId(parseInt(userId));
    }
    return this.userAvatarsService.findAll();
  }

  @Get("current/:userId")
  findCurrentByUserId(
    @Param("userId", ParseIntPipe) userId: number,
  ): Promise<UserAvatarResponseDto | null> {
    return this.userAvatarsService.findCurrentByUserId(userId);
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<UserAvatarResponseDto> {
    return this.userAvatarsService.findOneById(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserAvatarDto: UpdateUserAvatarDto,
  ): Promise<UserAvatarResponseDto> {
    return this.userAvatarsService.update(id, updateUserAvatarDto);
  }

  @Patch("user/:userId/set-current/:avatarId")
  setCurrentAvatar(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("avatarId", ParseIntPipe) avatarId: number,
  ): Promise<UserAvatarResponseDto> {
    return this.userAvatarsService.setCurrentAvatar(userId, avatarId);
  }

  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<UserAvatarResponseDto> {
    return this.userAvatarsService.delete(id);
  }
}
