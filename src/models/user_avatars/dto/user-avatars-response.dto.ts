export class UserAvatarResponseDto {
  id: number;
  user_id: number;
  avatar_id: number;
  is_current?: boolean;
  purchased_at?: Date;
  avatar?: {
    id: number;
    name?: string;
    image_url?: string;
    price?: number;
  };
}
