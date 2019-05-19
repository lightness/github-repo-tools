import { Module } from '@nestjs/common';
import { CliModule } from './modules/cli/cli.module';
import { NodeVersionModule } from './modules/node-version/node.version.module';
import { AppService } from './app.service';
import { TableModule } from './modules/table/table.module';
import { NpmDependencyVersionModule } from './modules/npm-dependency-version/npm.dependency.version.module';
import { RateLimitModule } from './modules/rate-limit/rate.limit.module';

@Module({
  imports: [
    CliModule,
    TableModule,
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
}
