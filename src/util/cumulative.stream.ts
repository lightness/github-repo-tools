import { Writable } from 'stream';

export class CumulativeWritable extends Writable {
  private accumulator: string = '';

  constructor(options) {
    super(options);
  }

  _write(chunk, encoding, callback) {
    this.accumulator += chunk;
  }

  public getAccumulated() {
    return this.accumulator;
  }
}