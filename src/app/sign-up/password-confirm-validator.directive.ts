import {Directive} from '@angular/core';
import {FormControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[appPasswordMatch][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordConfirmValidatorDirective,
      multi: true
    }
  ]
})
export class PasswordConfirmValidatorDirective implements Validator {

  constructor() {
  }

  validate(c: FormControl): ValidationErrors | null {
    const password = c.parent.get('password').value;
    const passwordConfirm = c.value;

    if (password !== passwordConfirm) {
      return {notMatching: true};
    }

    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
  }

}
