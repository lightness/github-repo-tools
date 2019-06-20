export enum Mode {
  NODE = 'node',
  PACKAGE = 'package',
  RATE_LIMIT = 'rate-limit'
}

export interface ValidResult {
  valid: true;
}

export interface InvalidResult {
  valid: false;
  askAbout: string; // TODO: add strictness
}

export type ValidationResult = ValidResult | InvalidResult;
