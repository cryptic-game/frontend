import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LoginService} from './login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginButton') loginButton: ElementRef;
  errorText = '';
  model = {username: '', password: '', keepLoggedIn: false};

  constructor(private loginService: LoginService, private router: Router) {
  }

  ngOnInit() {
  }

  performLogin() {
    this.loginService.login(this.model.username, this.model.password, this.model.keepLoggedIn).subscribe(
      data => {
        const error = data['error'];
        if (error === undefined) {

          const token = data['token'];
          if (this.model.keepLoggedIn) {
            localStorage.setItem('token', token);
          } else {
            sessionStorage.setItem('token', token);
          }

          setTimeout(() => this.router.navigateByUrl('/'), 500);

        } else {

          // this.errorText = error;
          console.log('Login error: ' + error);
          this.loginButton.nativeElement.disabled = true;
          setTimeout(
            () => (this.loginButton.nativeElement.disabled = false),
            500
          );

        }

      },
      error => {
        console.log(error);

        this.loginButton.nativeElement.disabled = true;
        setTimeout(
          () => (this.loginButton.nativeElement.disabled = false),
          500
        );
      }
    );
  }
}
