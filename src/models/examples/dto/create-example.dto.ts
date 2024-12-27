import { Type } from "class-transformer";
import { IsInt, IsString, ValidateNested } from "class-validator";

class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  country: string;
}

class UserDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

export class CreateExampleDto {
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}
