import { Injectable } from '@nestjs/common';
import { IProgramOptions, IOwnerOptions } from '../../interfaces';
import { Mode, ValidationResult } from './interfaces';

@Injectable()
export class InputValidatorService {

  public validate(options: IProgramOptions): ValidationResult {
    const mode = this.getMode(options);

    switch (mode) {
      case Mode.NODE:
      case Mode.PACKAGE:
        if (!this.getOwner(options)) {
          return { valid: false, askAbout: 'owner' };
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

  private getOwner({ org, user }: IOwnerOptions) {
    return org || user || null;
  }

}
