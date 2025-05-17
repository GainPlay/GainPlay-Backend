import { FRIENDSHIP_STATUSES_ARRAY } from "@/models/friendships/constants/friendship.consts";
import { UserNotFriend } from "@/models/friendships/dto/validators";
import { IsOptional, IsInt, IsString, IsIn, Validate } from "class-validator";

export class UpdateFriendshipDto {
  @IsString()
  @IsIn(FRIENDSHIP_STATUSES_ARRAY)
  status: string;
}
