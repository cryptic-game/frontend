import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginButton')
  loginButton: ElementRef;
  errorText = '';
  model = { username: '', password: '' };

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit() {}

  performLogin() {
    this.loginService.login(this.model.username, this.model.password).subscribe(
      data => {
        if (data.token != null) {
          localStorage.setItem('token', data.token);

          setTimeout(() => this.router.navigateByUrl('/'), 500);
        } else {
          this.loginButton.nativeElement.disabled = true;
          setTimeout(
            () => (this.loginButton.nativeElement.disabled = false),
            500
          );
        }
      });
  }
}
