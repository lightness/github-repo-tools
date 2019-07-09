import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { AppLogger } from './app.logger';
import { IProgramOptions } from './interfaces';
import { CumulativeWritable } from './util/cumulative.stream';
import { DEFAULT } from './config/default';

export async function grt(options: IProgramOptions) {
  const app = await NestFactory.createApplicationContext(
    AppModule.forApi(), 
    { logger: new AppLogger() }
  );

  const appService = app.get(AppService);
  await appService.run({ ...DEFAULT, ...options, json: true });
  const stream: CumulativeWritable = app.get('STREAM');

  return JSON.parse(stream.getAccumulated());
}
