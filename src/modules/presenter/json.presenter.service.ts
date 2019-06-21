import { Injectable } from "@nestjs/common";
import { RawJsonPresenterService } from "./raw.json.presenter.service";

@Injectable()
export class JsonPresenterService extends RawJsonPresenterService {
  private readonly INDENT: number = 2;

  protected log(data: object) {
    console.log(JSON.stringify(data, null, this.INDENT));
  }
}
