import { logger } from "@/common/helpers/logs";
import { HttpMessage } from "@/common/constants";

import {
  Catch,
  HttpStatus,
  ArgumentsHost,
  ExceptionFilter,
} from "@nestjs/common";

@Catch(Error)
export class GeneralExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const { name, stack, message } = exception;

    logger.error(message, {
      name: "general exception",
      exception: { name, stack },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: HttpMessage.INTERNAL_SERVER_ERROR,
    });
  }
}
