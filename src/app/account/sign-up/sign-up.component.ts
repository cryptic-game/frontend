import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  form: FormGroup;
  error: string;
  errorLive: number;
  passwordStrength: number;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService) {

    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/)]
      ],
      passwordConfirm: ['', Validators.required]
    });

    this.errorLive = 0;
    setInterval(() => {
      if (this.errorLive > 0) {
        this.errorLive -= 1;
      }

      if (this.errorLive <= 0) {
        this.error = undefined;
      }
    }, 1000);
    this.passwordStrength = 0;

    this.form.valueChanges.subscribe(data => this.passwordStrength = this.accountService.checkPassword(data.password));
  }

  signUp(): void {
    if (this.form.valid) {
      const value: { username: string, email: string, password: string, passwordConfirm: string } = this.form.value;
      if (value.password !== value.passwordConfirm) {
        this.error = 'The passwords do not match.';
        this.errorLive = 10;
        return;
      }

      this.accountService.signUp(value.username, value.email, value.password).subscribe(data => {
        this.accountService.finalLogin(data.token);
      }, error => {
        if (error.message === 'invalid email') {
          this.error = 'The email address is not valid.';
        } else if (error.message === 'username already exists') {
          this.error = 'This username is already taken.';
        } else {
          this.error = error.message;
        }

        this.errorLive = 10;
      });
    }
  }

}
