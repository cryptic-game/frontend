import { Component } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-control-center-settings-page',
  templateUrl: './control-center-settings-page.component.html',
  styleUrls: ['./control-center-settings-page.component.scss'],
})
export class ControlCenterSettingsPageComponent {
  passwordForm: FormGroup;
  passwordError: string;
  passwordStrength = 0;
  passwordChanged = false;

  constructor(
    public apiService: WebsocketService,
    private formBuilder: FormBuilder,
    private accountService: AccountService
  ) {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
          Validators.pattern(/[0-9]/),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[a-z]/),
        ],
      ],
      passwordConfirm: ['', Validators.required],
    });

    this.passwordForm.valueChanges.subscribe(
      (data) => (this.passwordStrength = this.accountService.checkPassword(data.newPassword))
    );
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const { newPassword, passwordConfirm } = this.passwordForm.value;
      if (newPassword !== passwordConfirm) {
        this.passwordError = $localize`The passwords do not match.`;
        this.passwordChanged = false;
        return;
      }

      this.accountService
        .changePassword(this.passwordForm.value.oldPassword, this.passwordForm.value.newPassword)
        .subscribe({
          next: () => {
            this.passwordError = '';
            this.passwordChanged = true;
            this.passwordStrength = 0;
            this.passwordForm.reset({ newPassword: '', oldPassword: '', passwordConfirm: '' });
          },
          error: (err: Error) => {
            this.passwordChanged = false;
            if (err.message === 'permissions denied') {
              this.passwordError = $localize`The old password is not correct.`;
            } else {
              this.passwordError = err.message;
              console.warn(err);
            }
          },
        });
    }
  }
}
