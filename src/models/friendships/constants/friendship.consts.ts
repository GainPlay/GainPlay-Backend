export enum FriendshipStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  BLOCKED = "blocked",
  NONE = "none",
}

export const FRIENDSHIP_STATUSES_ARRAY: FriendshipStatus[] =
  Object.values(FriendshipStatus);

export const SELECTION_FIELDS = {
  id: true,
  name: true,
  email: true,
  level: true,
  avatar_url: true,
  experience: true,
};
