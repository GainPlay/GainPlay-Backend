import { ValidationError } from "class-validator";
import { HttpException, HttpStatus } from "@nestjs/common";

export class ValidationException extends HttpException {
  private readonly detailedErrors: ValidationError[];

  constructor(validationErrors: ValidationError[]) {
    super(
      ValidationException.formattedErrors(validationErrors),
      HttpStatus.BAD_REQUEST,
    );
    this.detailedErrors = validationErrors;
  }

  public static formattedErrors(validationErrors: ValidationError[]): string[] {
    return this.traverseErrors(validationErrors);
  }

  private static traverseErrors(
    validationErrors: ValidationError[],
    parentPath = "",
  ): string[] {
    const result = [];

    for (const error of validationErrors) {
      const propertyPath = parentPath
        ? `${parentPath}.${error.property}`
        : error.property;

      if (error.constraints) {
        for (const constraint of Object.values(error.constraints)) {
          result.push(`${propertyPath} - ${constraint}`);
        }
      }

      if (error.children?.length > 0) {
        result.push(...this.traverseErrors(error.children, propertyPath));
      }
    }

    return result;
  }
}
