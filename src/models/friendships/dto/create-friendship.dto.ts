import { FRIENDSHIP_STATUSES_ARRAY } from "@/models/friendships/constants/friendship.consts";
import { IsOptional, IsInt, IsString, IsIn } from "class-validator";

export class CreateFriendshipDto {
  @IsInt()
  user_id: number;

  @IsInt()
  friend_id: number;

  @IsString()
  @IsIn(FRIENDSHIP_STATUSES_ARRAY)
  status: string;
}
