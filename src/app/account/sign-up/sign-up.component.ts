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
  errorLife = 0;
  errorLifeHandle: any;
  passwordStrength: number;

  constructor(private formBuilder: FormBuilder,
              private accountService: AccountService) {
    this.form = this.formBuilder.group({
      username: [history.state?.username ?? '', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(256)]
      ],
      password: [history.state?.password ?? '', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/)]
      ],
      passwordConfirm: ['', Validators.required]
    });

    this.passwordStrength = this.accountService.checkPassword(this.form.value.password);

    this.form.valueChanges.subscribe(data => this.passwordStrength = this.accountService.checkPassword(data.password));
  }

  signUp(): void {
    if (this.form.valid) {
      const value: { username: string, password: string, passwordConfirm: string } = this.form.value;
      if (value.password !== value.passwordConfirm) {
        this.error = 'The passwords do not match.';
        this.decayError(10);
        return;
      }

      this.accountService.signUp(value.username, value.password).subscribe(data => {
        this.accountService.finalLogin(data.token, '/create-device');
      }, error => {
        if (error.message === 'username already exists') {
          this.error = 'This username is already taken.';
        } else {
          this.error = error.message;
        }

        this.decayError(10);
      });
    }
  }

  decayError(duration: number) {
    this.errorLife = duration;
    clearInterval(this.errorLifeHandle);
    this.errorLifeHandle = setInterval(() => {
      if (this.errorLife > 0) {
        this.errorLife -= 1;
      }

      if (this.errorLife <= 0) {
        this.error = undefined;
      }
    }, 1000);
  }
}
