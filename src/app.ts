#!/usr/bin/env node 
import { NestFactory } from '@nestjs/core';
import * as figlet from 'figlet';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { AppLogger } from './app.logger';

async function bootstrap() {
  console.log(figlet.textSync('Github Repo Tools'));

  const app = await NestFactory.createApplicationContext(AppModule, { logger: new AppLogger() });

  const appService = app.get(AppService);
  await appService.main();
}

bootstrap();
