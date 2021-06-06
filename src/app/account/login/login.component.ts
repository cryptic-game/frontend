import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { AuthService } from '../../_core/auth/auth.service';
import { mergeMap, tap } from 'rxjs/operators';

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
    private readonly formBuilder: FormBuilder,
    private readonly accountService: AccountService,
    private readonly authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      username: [history.state?.username ?? '', Validators.required],
      password: [history.state?.password ?? '', Validators.required]
    });
  }

  oauthLogin(provider: number): void {
    this.authService.getProviders()
      .pipe(
        tap(providers => this.authService.provider = providers[provider]),
        mergeMap(_ => this.authService.getSession())
      )
      .subscribe(console.log);
  }

  logout(): void {
    this.authService.token = null;
    this.authService.provider = null;
  }

  login(): void {
    if (this.form.valid) {
      const value: { username: string, password: string } = this.form.value;

      this.accountService.login(value.username, value.password).subscribe(data => {
        this.accountService.finalLogin(data.token, '/');
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
        this.error = undefined;
      }
    }, 1000);
  }
}
