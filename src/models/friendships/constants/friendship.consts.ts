import { FriendshipStatus } from "@/models/friendships/interfaces/friendships.types";

export const FRIENDSHIP_STATUSES = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  BLOCKED: "blocked",
} as const;

export const FRIENDSHIP_STATUSES_ARRAY: FriendshipStatus[] = Object.values(FRIENDSHIP_STATUSES);
