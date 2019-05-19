import { Module } from "@nestjs/common";
import { OctokitModule } from "../octokit/octokit.module";
import { NodeVersionService } from "./node.version.service";

@Module({
  imports: [OctokitModule],
  providers: [NodeVersionService],
  exports: [NodeVersionService],
})
export class NodeVersionModule {

}