import { Module } from '@nestjs/common';
import { NodeVersionService } from './node.version.service';
import { PresenterModule } from '../presenter/presenter.module';
import { CodeRepositoryModule } from '../code-repository/code-repository.module';

@Module({
  imports: [
    CodeRepositoryModule,
    PresenterModule,
  ],
  providers: [NodeVersionService],
  exports: [NodeVersionService],
})
export class NodeVersionModule {

}
