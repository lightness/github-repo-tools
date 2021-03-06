import { IProgramOptions, IReportItem } from "../../interfaces";
import { OctokitService } from "../octokit/octokit.service";
import { PresenterService } from "../presenter/presenter.service";

export abstract class BaseReportService<T extends IReportItem> {

  constructor(
    protected octokitService: OctokitService,
    protected presenterService: PresenterService,
  ) {
  }

  protected abstract handleRepo(repo: string, options: IProgramOptions): Promise<T>;

  public async getReport(options: IProgramOptions): Promise<T[]> {
    const { org, user, token, repos } = options;

    const reposToSearch = repos || await this.octokitService.getRepos({ org, user, token });

    if (!reposToSearch) {
      return null;
    }

    this.presenterService.showProcessingSpinner(options);
    const result = await Promise.all(
      reposToSearch.map(async repo => await this.getRepoReport(repo, options))
    );
    this.presenterService.hideSpinner({ success: true });

    return result;
  }

  private async getRepoReport(repo: string, options: IProgramOptions): Promise<T> {
    try {
      return await this.handleRepo(repo, options);
    }
    catch (e) {
      return { repo, error: e.message } as T;
    }
  }

}
