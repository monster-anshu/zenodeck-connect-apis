import fastifyCookie from '@fastify/cookie';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger, ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from '~/app.module';
import { CONNECT_API_URL, NODE_ENV, PORT } from '~/env';
import { SessionMiddlewareFn } from '~/session/session.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );

  await app.register(fastifyCookie);
  app.getHttpAdapter().getInstance().addHook('onRequest', SessionMiddlewareFn);
  // .addHook('onSend', onHeader);

  app.setGlobalPrefix('/api/v1/connect');
  app.useGlobalPipes(new ZodValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Zenodeck Connect Apis')
    .setVersion('1.0')
    .addServer(CONNECT_API_URL);

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('docs', app, documentFactory, {
    useGlobalPrefix: true,
    jsonDocumentUrl: 'swagger.json',
  });

  await app.listen(PORT, '0.0.0.0');
}

patchNestJsSwagger();
bootstrap();
