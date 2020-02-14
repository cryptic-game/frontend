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
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    });

    this.errorLive = 0;
    setInterval(() => {
      if (this.errorLive > 0) {
        this.errorLive -= 1000;
      } else {
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
        this.error = 'The passwords are not the equal.';
        this.errorLive = 10000;
      }

      if (this.accountService.checkPassword(value.password) < 5) {
        this.error = 'The password is too weak.';
        this.errorLive = 10000;
      }

      this.accountService.signUp(value.username, value.email, value.password).subscribe(data => {
        if (data.error === 'invalid email') {
          this.error = 'The e-mail address is not valid.';
          this.errorLive = 10000;
        } else if (data.error === 'username already exists') {
          this.error = 'This username is already taken.';
          this.errorLive = 10000;
        } else if (data.error) {
          this.error = data.error;
          this.errorLive = 10000;
        } else {
          this.accountService.finalLogin(data.token);
        }
      });
    }
  }
}
