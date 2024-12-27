import { logger } from "@/common/helpers/logs";
import {
  Catch,
  HttpException,
  ArgumentsHost,
  ExceptionFilter,
} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const STATUS = exception.getStatus();
    const { name, stack, cause, message } = exception;

    logger.error(message, {
      name: "http exception",
      status: exception.getStatus(),
      exception: { name, stack, cause },
    });

    response.status(STATUS).json({
      status: STATUS,
      error: message,
    });
  }
}
