import { IsInt, Min } from "class-validator";

export class UpdateUserGoalValueDto {
  @IsInt()
  @Min(0)
  value: number;
}
