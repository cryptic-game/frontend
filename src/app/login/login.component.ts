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
  formHiding = false;

  constructor(private loginService: LoginService, private router: Router) {
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

          setTimeout(() => this.router.navigateByUrl('/'), 500);

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
