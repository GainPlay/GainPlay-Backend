import { Response } from "express";
import { logger } from "@/common/helpers/logs";
import { ValidationException } from "@/common/exceptions/ValidationException.exception";
import {
  Catch,
  HttpStatus,
  ArgumentsHost,
  ExceptionFilter,
} from "@nestjs/common";

@Catch(ValidationException)
export class ValidationExceptionsFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const errors = exception.getResponse();

    logger.error("validation exception", {
      errors,
      status,
      name: "validation exception",
    });

    response.status(status).json(errors);
  }
}
