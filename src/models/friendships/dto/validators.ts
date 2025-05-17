import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ async: false, name: "UserNotFriend" })
export class UserNotFriend implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const object = args.object as any;
    return object.user_id !== object.friend_id;
  }

  defaultMessage(): string {
    return "user_id and friend_id must be different";
  }
}
