import { IsInt, IsString, IsIn, Validate } from "class-validator";
import { UserNotFriend } from "@/models/friendships/dto/validators";
import { FRIENDSHIP_STATUSES_ARRAY } from "@/models/friendships/constants/friendship.consts";

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
