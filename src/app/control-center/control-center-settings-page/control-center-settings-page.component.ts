import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../websocket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-control-center-settings-page',
  templateUrl: './control-center-settings-page.component.html',
  styleUrls: ['./control-center-settings-page.component.scss']
})
export class ControlCenterSettingsPageComponent implements OnInit {

  passwordForm: FormGroup;
  passwordError: string;
  passwordStrength = 0;
  passwordChanged = false;

  constructor(public apiService: WebsocketService, private formBuilder: FormBuilder, private accountService: AccountService) {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/)
      ]],
      passwordConfirm: ['', Validators.required]
    });

    this.passwordForm.valueChanges.subscribe(data => this.passwordStrength = this.accountService.checkPassword(data.newPassword));
  }

  ngOnInit(): void {
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const { newPassword, passwordConfirm } = this.passwordForm.value;
      if (newPassword !== passwordConfirm) {
        this.passwordError = 'The passwords do not match.';
        this.passwordChanged = false;
        return;
      }

      this.accountService.changePassword(
        this.passwordForm.value.oldPassword, this.passwordForm.value.newPassword
      ).subscribe(() => {
        this.passwordError = '';
        this.passwordChanged = true;
        this.passwordStrength = 0;
        this.passwordForm.reset({ newPassword: '', oldPassword: '', passwordConfirm: '' });
      }, error => {
        this.passwordChanged = false;
        if (error.message === 'permissions denied') {
          this.passwordError = 'The old password is not correct.';
        } else {
          this.passwordError = error.message;
          console.warn(error);
        }
      });
    }
  }

}
