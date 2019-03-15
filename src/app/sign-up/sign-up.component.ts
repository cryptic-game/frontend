import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SignUpService } from './sign-up.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

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
  model = { username: '', email: '', password: '', passwordConfirm: '' };

  constructor(private signUpService: SignUpService, private router: Router) {
  }

  ngOnInit() {
  }


  performSignup() {
    this.signUpService.signUp(this.model.username, this.model.email, this.model.password).subscribe(data => {
      const error = data['error'];
      if (error === undefined) {
        this.router.navigateByUrl('/login');
      } else {
        this.errorText = data['error'];
      }

    },
      (error: HttpErrorResponse) => {
        console.log(error);
        try {
          this.errorText = error.error.message; // error.error referes to the backend response, or to the Browser's Error Message, can be undefined
        } catch (e) {
          this.errorText = 'An error has occurred';
        }
        if (this.errorText === undefined) {
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
