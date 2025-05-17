import { IsString, IsIn } from "class-validator";
import { FRIENDSHIP_STATUSES_ARRAY } from "@/models/friendships/constants/friendship.consts";

export class UpdateFriendshipDto {
  @IsString()
  @IsIn(FRIENDSHIP_STATUSES_ARRAY)
  status: string;
}
