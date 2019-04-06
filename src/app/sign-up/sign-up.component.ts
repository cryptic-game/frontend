import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SignUpService} from './sign-up.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  @ViewChild('submitButton') loginButton: ElementRef;
  @ViewChild('passwordField') passwordField: ElementRef;
  @ViewChild('passwordConfirm') passwordConfirmField: ElementRef;
  errorText: string;
  model = {username: '', email: '', password: '', passwordConfirm: ''};

  constructor(private signUpService: SignUpService, private router: Router) {
  }

  ngOnInit() {
  }


  performSignup() {
    this.signUpService.signUp(this.model.username, this.model.email, this.model.password).subscribe(
      data => {
        if (data.token !== null) {
          sessionStorage.setItem('token', data.token);
          localStorage.setItem('username', data.name);

          this.router.navigateByUrl('/').then().catch();
        } else {
          console.log(data);
          this.errorText = 'An error has occurred';

          this.loginButton.nativeElement.disabled = true;
          setTimeout(
            () => (this.loginButton.nativeElement.disabled = false),
            500
          );
        }
      },
      (error: HttpErrorResponse) => {
        // error.error refers to the backend response or to the browser's error message, can be undefined
        if (error.error !== undefined && error.error['message'] !== undefined) {
          this.errorText = error.error['message'];
        } else {
          console.log(error);
          this.errorText = 'An error has occurred';
        }

        this.loginButton.nativeElement.disabled = true;
        setTimeout(
          () => (this.loginButton.nativeElement.disabled = false),
          500
        );
      }
    );
  }
}
