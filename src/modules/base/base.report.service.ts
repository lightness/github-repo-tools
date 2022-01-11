import { IProgramOptions, IReportItem } from "../../interfaces";
import { CodeRepositoryService } from "../code-repository/code-repository.service";
import { RepoInfo } from "../code-repository/repo-info";
import { PresenterService } from "../presenter/presenter.service";

export abstract class BaseReportService<T extends IReportItem> {

  constructor(
    protected codeRepositoryService: CodeRepositoryService,
    protected presenterService: PresenterService,
  ) {
  }

  protected abstract handleRepo(repo: RepoInfo, options: IProgramOptions): Promise<T>;

  public async getReport(options: IProgramOptions): Promise<T[]> {
    const { repos } = options;

    const reposToSearch = repos 
      ? repos.map(repo => new RepoInfo(repo)) 
      : await this.codeRepositoryService.getRepos(options);

    if (!reposToSearch) {
      return null;
    }

    this.presenterService.showProcessingSpinner(options);
    const result: T[] = await Promise.all(
      reposToSearch.map(async (repo) => await this.getRepoReport(repo, options))
    );
    this.presenterService.hideSpinner({ success: true });

    return result;
  }

  private async getRepoReport(repo: RepoInfo, options: IProgramOptions): Promise<T> {
    try {
      return await this.handleRepo(repo, options);
    }
    catch (e) {
      return { repo: repo.name, error: e.message } as T;
    }
  }

}
