import { Injectable } from '@nestjs/common';
import { RawJsonPresenterService } from './raw.json.presenter.service';

@Injectable()
export class JsonPresenterService extends RawJsonPresenterService {
  private readonly INDENT: number = 2;

  protected write(data: object) {
    this.stream.write(JSON.stringify(data, null, this.INDENT));
  }
}
