import { Module } from '@nestjs/common';
import { OctokitService } from './octokit.service';
import { PresenterModule } from '../presenter/presenter.module';
import { CliModule } from '../cli/cli.module';

@Module({
  imports: [
    PresenterModule,
    CliModule,
  ],
  providers: [OctokitService],
  exports: [OctokitService]
})
export class OctokitModule {
}
