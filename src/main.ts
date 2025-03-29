import helmet from "helmet";
import { json } from "body-parser";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { ValidationPipe } from "@nestjs/common";
import { morganLogger } from "@/common/middlewares/logs";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { GeneralExceptionFilter } from "@/common/filters/general-exception.filter";
import { ValidationException } from "@/common/exceptions/ValidationException.exception";
import { ValidationExceptionsFilter } from "@/common/filters/validation-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());
  app.getHttpAdapter().getInstance().disable("x-powered-by");
  app.use(morganLogger);
  app.use(json({ limit: "10mb" }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors = []) => {
        return new ValidationException(validationErrors);
      },
    }),
  );

  app.useGlobalFilters(
    new GeneralExceptionFilter(),
    new HttpExceptionFilter(),
    new ValidationExceptionsFilter(),
  );

  if (["development", "test"].includes(process.env.NODE_ENV)) {
    // only enable swagger in development and test
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle("GainPlay API")
      .setDescription("GainPlay API")
      .setVersion("1.0")
      .addTag("GainPlay")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);
  }

  app.setGlobalPrefix("/api", { exclude: ["/"] });
  await app.listen(3000);
}
bootstrap();
