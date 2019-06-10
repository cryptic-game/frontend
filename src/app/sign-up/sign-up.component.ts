import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SignUpService } from './sign-up.service';
import { Router } from '@angular/router';

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
    this.signUpService.signUp(this.model.username, this.model.email, this.model.password).subscribe(
      data => {
        if (data.token != null) {
          localStorage.setItem('token', data.token);

          setTimeout(
            () => (this.router.navigateByUrl('/')),
            500
          );
        } else {
          this.errorText = data.error;

          this.loginButton.nativeElement.disabled = true;
          setTimeout(
            () => (this.loginButton.nativeElement.disabled = false),
            500
          );
        }
      });
  }
}
