import { IsString } from "class-validator";

export class MessageResponseDto {
  @IsString()
  readonly answer: string;
  @IsString()
  readonly timestamp: string;
}
