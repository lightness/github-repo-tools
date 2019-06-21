#!/usr/bin/env node 
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { AppLogger } from './app.logger';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: new AppLogger() });

  const appService = app.get(AppService);
  await appService.main();
}

bootstrap();
