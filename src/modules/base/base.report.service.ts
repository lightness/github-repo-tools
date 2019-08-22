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
    const { org, user, nvm, engines, token } = options;

    const repos = await this.octokitService.getRepos({ org, user, token });

    if (!repos) {
      return null;
    }

    this.presenterService.showSearchNodeVersion({ nvm, engines });
    this.presenterService.showSpinner(`Search in every repo...`);
    const result = await Promise.all(
      repos.map(async repo => {
        try {
          return await this.handleRepo(repo, options);
        }
        catch (e) {
          return { repo, error: e.message } as T;
        }
      })
    );
    this.presenterService.hideSpinner({ success: true });

    return result;
  }

}
