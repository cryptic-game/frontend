import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  logout(token) {
    const httpOptions = {
      headers: new HttpHeaders({
        Token: token
      })
    };

    this.http
      .delete(this.url, httpOptions)
      .subscribe(data => console.log(data));

    localStorage.removeItem('token');
    localStorage.removeItem('desktop');

    this.router.navigate(['login']);
  }

  list(token) {
    const httpOptions = {
      headers: new HttpHeaders({
        Token: token
      })
    };

    return this.http.post('', null, httpOptions);
  }

  owner(token) {
    const httpOptions = {
      headers: new HttpHeaders({
        Token: token
      })
    };

    return this.http.post('', null, httpOptions);
  }
}
