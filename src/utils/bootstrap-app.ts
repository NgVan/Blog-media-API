/* eslint-disable prettier/prettier */
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
// import { join } from 'node:path';
import 'source-map-support/register';
import { ErrorResponseTransformInterceptor } from '../interceptors/error-response-transform.interceptor';
import { SuccessResponseTransformInterceptor } from '../interceptors/success-response-transform.interceptor';
import { ConfigService } from '../modules/shared/services/config.service';

export async function bootstrapApp(app: NestExpressApplication) {
  const configService = new ConfigService();
  const { apiVersion } = configService;
  app.setGlobalPrefix(apiVersion, {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle('Blog Media API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('blog')
    .addBearerAuth(
      {
        // I was also testing it without prefix 'Bearer ' before the JWT
        description: `Authentication with JWT`,
        name: 'Authorization',
        bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header',
      },
      'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.use(helmet());
  const { corsEnabled, corsAllowedOrigins } = new ConfigService();
  const cors = corsEnabled
    ? {
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: [
          'Authorization',
          'RefreshToken',
          'Content-Type',
          'Accept',
          'Origin',
          'Referer',
          'User-Agent',
          'Authorization',
          'X-Signature',
          'X-Api-Key',
          'X-Request-Id',
        ],
        exposedHeaders: [
          'Authorization',
          'RefreshToken',
          'X-Api-Key',
          'AccessToken',
          'X-Signature',
        ],
        origin(
          origin: string,
          callback: (error: Error | null, success?: true) => void,
        ) {
          if (corsAllowedOrigins === 'all') {
            callback(null, true);
            return;
          }
          if (corsAllowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`Origin[${origin}] not allowed by CORS`));
          }
        },
      }
    : {};
  app.enableCors(cors);
  app.useGlobalInterceptors(
    new SuccessResponseTransformInterceptor(),
    new ErrorResponseTransformInterceptor(),
  );
}
