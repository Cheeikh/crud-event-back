import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activer CORS avec l'origine du frontend spécifiée explicitement
  app.enableCors({
    origin: 'http://localhost:8080', // URL du frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Utiliser ValidationPipe globalement
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non définies dans les DTOs
      forbidNonWhitelisted: true, // Renvoie une erreur si des propriétés non whitelisted sont présentes
      transform: true, // Transforme les payloads pour correspondre aux types DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3001); // Note: le port était 3000, changé à 3001 pour correspondre au frontend
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
