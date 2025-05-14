export enum FriendshipStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  BLOCKED = "blocked",
  NOT_FRIENDS = "not_friends",
}

export const FRIENDSHIP_STATUSES_ARRAY: FriendshipStatus[] = Object.values(FriendshipStatus);

export const SELECTION_FIELDS = {
  id: true,
  name: true,
  avatar_url: true,
  email: true,
  level: true,
  experience: true,
};
