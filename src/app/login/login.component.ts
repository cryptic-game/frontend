import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LoginService} from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginButton') loginButton: ElementRef;
  formHiding = false;

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
  }

  performLogin(username: string, password: string, keepLoggedIn: boolean) {
    this.loginService.login(username, password, keepLoggedIn).subscribe(
      data => {
        const error = data['error'];
        if (error === undefined) {

          const token = data['token'];
          if (keepLoggedIn) {
            localStorage.setItem('token', token);
          } else {
            sessionStorage.setItem('token', token);
          }

          this.formHiding = true;

          setTimeout(() => {/* TODO: navigate to / */
          }, 500);

        } else {

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
