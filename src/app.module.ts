import { Module, DynamicModule, Global } from '@nestjs/common';
import { CliModule } from './modules/cli/cli.module';
import { NodeVersionModule } from './modules/node-version/node.version.module';
import { AppService } from './app.service';
import { NpmDependencyVersionModule } from './modules/npm-dependency-version/npm.dependency.version.module';
import { RateLimitModule } from './modules/rate-limit/rate.limit.module';
import { PresenterModule } from './modules/presenter/presenter.module';
import { CumulativeWritable } from './util/cumulative.stream';

@Global()
@Module({
  imports: [
    PresenterModule,
    RateLimitModule,
    NodeVersionModule,
    NpmDependencyVersionModule,
  ],
  providers: [
    AppService,
  ],
  exports: [
    AppService,
  ],
})
export class AppModule {
  static forApi(): DynamicModule {
    const streamProvider = { 
      provide: 'STREAM', 
      useFactory: () => new CumulativeWritable({}) 
    };

    return {
      module: AppModule,
      providers: [streamProvider],
      exports: [streamProvider],
    };
  }

  static forCli(): DynamicModule {
    const streamProvider = { 
      provide: 'STREAM', 
      useValue: process.stdout 
    };

    return {
      module: AppModule,
      imports: [CliModule],
      providers: [streamProvider],
      exports: [streamProvider],
    };
  }
}
