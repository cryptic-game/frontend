import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup;
  error: string;
  errorLive: number;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService) {

    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
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
  }

  login(): void {
    if (this.form.valid) {
      const value: { username: string, password: string } = this.form.value;

      this.accountService.login(value.username, value.password).subscribe(data => {
        if (data.error) {
          if (data.error === 'permissions denied') {
            this.error = 'This username and password could not be found.';
          } else {
            this.error = data.error;
          }

          this.errorLive = 10;
          return;
        }

        this.accountService.finalLogin(data.token);
      });
    }
  }
}
