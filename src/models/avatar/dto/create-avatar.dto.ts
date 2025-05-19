import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateAvatarDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  price?: number;
}
