import { FRIENDSHIP_STATUSES } from "@/models/friendships/constants/friendship.consts";

export type FriendshipStatus = (typeof FRIENDSHIP_STATUSES)[keyof typeof FRIENDSHIP_STATUSES];