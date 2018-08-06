import {ErrorBackend} from './error_backend.class';

export class Data {
  private errors: Array<ErrorBackend>;
  private data: Array<JSON>;

  constructor(errors: Array<ErrorBackend>, data: Array<JSON>) {
    this.errors = errors;
    this.data = data;
  }

  public getErrors(): Array<ErrorBackend> {
    return this.errors;
  }
  public getData(): Array<JSON> {
    return this.data;
  }
  public setErrors(errors: Array<ErrorBackend>): void {
    this.errors = errors;
  }
  public setData(data: Array<JSON>): void {
    this.data = data;
  }
}
