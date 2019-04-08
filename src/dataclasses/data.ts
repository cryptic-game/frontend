import {ErrorBackend} from './error_backend';

export class Data {
  constructor(public errors: Array<ErrorBackend>,
              public data: Array<JSON>) {
  }

  // TODO public isError() {}
  // TODO public isSuccess() {}
}
