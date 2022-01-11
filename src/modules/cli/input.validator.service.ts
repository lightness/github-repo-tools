import { Injectable } from '@nestjs/common';
import { IProgramOptions, RepoService } from '../../interfaces';
import { Mode, ValidationResult } from './interfaces';

@Injectable()
export class InputValidatorService {

  public validate(options: IProgramOptions): ValidationResult {
    const mode = this.getMode(options);

    switch (mode) {
      case Mode.NODE:
      case Mode.PACKAGE:
        switch (options.repoService) {
          case RepoService.GITHUB:
            if (!this.getOwner(options)) {
              return { valid: false, askAbout: 'owner' };
            }

            return { valid: true };
          case RepoService.BITBUCKET:
            if (!this.getWorkspace(options)) {
              return { valid: false, askAbout: 'workspace' };
            }

            return { valid: true };
        }
      case Mode.RATE_LIMIT:
        return { valid: true };
      default:
        return { valid: false, askAbout: 'mode' };
    }
  }

  private getMode({ node, package: packageName, rateLimit }: IProgramOptions): Mode {
    if (node) {
      return Mode.NODE;
    }

    if (packageName) {
      return Mode.PACKAGE;
    }

    if (rateLimit) {
      return Mode.RATE_LIMIT;
    }

    return null;
  }

  private getOwner({ org, user }: IProgramOptions) {
    return org || user || null;
  }

  private getWorkspace({ workspace }: IProgramOptions) {
    return workspace || null;
  }

}
