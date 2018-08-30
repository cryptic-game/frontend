import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SignUpService} from './sign-up.service';

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

  constructor(private signUpService: SignUpService) {
  }

  ngOnInit() {
  }

  validatePassword(password) {
    if (password.length <= 4) {
      this.passwordField.nativeElement.setCustomValidity('Password is too short');
    } else {
      this.passwordField.nativeElement.setCustomValidity('');
    }

    if (password !== this.passwordConfirmField.nativeElement.value) {
      this.passwordConfirmField.nativeElement.setCustomValidity('Passwords do not match');
    } else {
      this.passwordConfirmField.nativeElement.setCustomValidity('');
    }
  }

  performSignup(username: string, email: string, password: string) {
    this.signUpService.signUp(username, email, password).subscribe(data => {
        const error = data['error'];
        if (error === undefined) {
          // TODO: navigate to /login
        } else {
          this.errorText = data['error'];
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
