import { FRIENDSHIP_STATUSES_ARRAY } from "@/models/friendships/constants/friendship.consts";
import { UserNotFriend } from "@/models/friendships/dto/validators";
import { IsOptional, IsInt, IsString, IsIn, Validate } from "class-validator";

export class CreateFriendshipDto {
  @IsInt()
  user_id: number;

  @IsInt()
  friend_id: number;

  @IsString()
  @IsIn(FRIENDSHIP_STATUSES_ARRAY)
  status: string;

  @Validate(UserNotFriend)
  readonly checkUsersAreNotEqual: boolean;
}
