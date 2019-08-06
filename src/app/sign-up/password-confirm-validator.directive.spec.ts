import { PasswordConfirmValidatorDirective } from './password-confirm-validator.directive';
import { FormControl, FormGroup } from '@angular/forms';

describe('PasswordConfirmValidatorDirective', () => {
  it('should create an instance', () => {
    const directive = new PasswordConfirmValidatorDirective();
    expect(directive).toBeTruthy();
  });

  it('#validate should return no error when password confirm field matches the password field', () => {
    const directive = new PasswordConfirmValidatorDirective();
    const randomPassword = Math.random().toString();

    const passwordConfirmControl = new FormControl(randomPassword);
    const passwordControl = new FormControl(randomPassword);
    const formGroup = new FormGroup({ 'password': passwordControl, 'passwordConfirm': passwordConfirmControl });
    passwordConfirmControl.setParent(formGroup);
    passwordControl.setParent(formGroup);

    const result = directive.validate(passwordConfirmControl);
    expect(result).toEqual(null);
  });

  it('#validate should return a notMatching error when password confirm field does not match the password field', () => {
    const directive = new PasswordConfirmValidatorDirective();

    const passwordConfirmControl = new FormControl('another password');
    const passwordControl = new FormControl('some password');
    const formGroup = new FormGroup({ 'password': passwordControl, 'passwordConfirm': passwordConfirmControl });
    passwordConfirmControl.setParent(formGroup);
    passwordControl.setParent(formGroup);

    const result = directive.validate(passwordConfirmControl);
    expect(result).toEqual({ 'notMatching': true });
  });
});
