import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ProgramLinkageBackend } from './../../dataclasses/programlinkagebackend.class';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  constructor(private http: HttpClient) {}

  url = 'https://api.dev.cryptic-game.net';

  list(token) {
    const httpOptions = {
      headers: new HttpHeaders({
        Token: token
      })
    };

    return this.http.post<Array<ProgramLinkageBackend>>(
      `${this.url}/shortcut/list`,
      null,
      httpOptions
    );
  }

  update(token, data) {
    const httpOptions = {
      headers: new HttpHeaders({
        Token: token
      })
    };

    return this.http.post(`${this.url}/shortcut/update`, data, httpOptions);
  }
}
