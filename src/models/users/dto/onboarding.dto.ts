import { Type } from "class-transformer";
import {
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
  IsString,
} from "class-validator";

export class TechnicalDataDto {
  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;
}

export class OnboardingDto {
  @IsNumber()
  fitnessLevel: number;

  @IsObject()
  fitnessGoals: Record<string, number>;

  @IsNumber()
  workoutFrequency: number;

  @IsNumber()
  workoutDuration: number;

  @IsOptional()
  @IsString()
  bodyStructure?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TechnicalDataDto)
  technicalData?: TechnicalDataDto;
}
