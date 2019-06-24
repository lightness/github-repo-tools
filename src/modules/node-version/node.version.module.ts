import { Module } from '@nestjs/common';
import { OctokitModule } from '../octokit/octokit.module';
import { NodeVersionService } from './node.version.service';
import { PresenterModule } from '../presenter/presenter.module';

@Module({
  imports: [
    OctokitModule,
    PresenterModule,
  ],
  providers: [NodeVersionService],
  exports: [NodeVersionService],
})
export class NodeVersionModule {

}
