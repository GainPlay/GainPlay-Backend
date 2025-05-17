import { IsNumber, IsString } from "class-validator";

export class MessageRequestDto {
  @IsNumber()
  userId: number;

  @IsString()
  message: string;
}
