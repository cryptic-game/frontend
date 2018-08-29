import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  signUpURL = 'https://api.dev.cryptic-game.net/user/register';

  constructor(private http: HttpClient) {
  }

  signUp(username: string, email: string, password: string) {
    const data = new FormData();
    data.append('username', username);
    data.append('email', email);
    data.append('password', password);


    return this.http.post(this.signUpURL, data, {headers: new HttpHeaders({'enctype': 'multipart/form-data'})});
  }
}
