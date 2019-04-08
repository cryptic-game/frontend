export class Session {

  constructor(public token: string, public createDate: Date, public expireDate: Date) {
  }

  // TODO public isValid() {}

}
