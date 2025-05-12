import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@ValidatorConstraint({ name: "UserNotFriend", async: false })
export class UserNotFriend implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const object = args.object as any;
    return object.user_id !== object.friend_id;
  }

  defaultMessage(): string {
    return "user_id and friend_id must be different";
  }
}
