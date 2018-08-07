import {Component, OnInit} from '@angular/core';
import {LoginService} from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  performLogin(username: string, password: string, keepLoggedIn: boolean) {
    this.loginService.login(username, password).subscribe(data => {
      const token = data['token'];
      if (keepLoggedIn) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
    }, error => {
      console.log(error);
    });
  }

}
