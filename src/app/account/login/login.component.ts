import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup;
  error: string;
  errorLife = 0;
  errorLifeHandle: any;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService) {

    this.form = this.formBuilder.group({
      username: [history.state?.username ?? '', Validators.required],
      password: [history.state?.password ?? '', Validators.required]
    });
  }

  login(): void {
    if (this.form.valid) {
      const value: { username: string; password: string } = this.form.value;

      this.accountService.login(value.username, value.password).subscribe(data => {
        this.accountService.finalLogin(data.token!, '/');
      }, error => {
        if (error.message === 'permissions denied') {
          this.error = 'This username and password could not be found.';
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
        this.error = undefined!;
      }
    }, 1000);
  }
}
